const moment = require('moment');
const {Rental} = require('../../../models/rental');
const mongoose = require('mongoose');
const request = require('supertest');
const {User} = require('../../../models/user');
const {Movie} = require('../../../models/movie');

describe('/apireturns', () => {
    let server;
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;

    beforeEach( async () => { 
        server = require('../../../index');
        
        movieId = mongoose.Types.ObjectId();
        customerId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10
        });
        await movie.save();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async () => { 
        await server.close();
        await Rental.deleteMany({});
        await Movie.deleteMany({});
    });

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                customerId,
                movieId
            });
    }
    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });
    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 404 if no rental found for this customer/movie', async () => {
        await Rental.deleteOne({ _id: rental._id });
        const res = await exec();
        expect(res.status).toBe(404);
    });
    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        const res = await exec();
        expect(res.status).toBe(400);
    });
    it('should return 200 if valid request', async () => {
        const res = await exec();
        expect(res.status).toBe(200);
    });
    it('should set the return date if valid request', async () => {
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10000);
    });
    it('should set the rental fee if input is valid', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(rentalInDb.rentalFee).toBe(14);
    });
    it('should increase the movie stock', async () => {
        const res = await exec();

        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });
    it('should return the rental if request is valid', async () => {
        const res = await exec();
        const rentalInDb = await Rental.findById(rental._id);

        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned',
            'rentalFee', 'customer', 'movie']
        ));
    });
});