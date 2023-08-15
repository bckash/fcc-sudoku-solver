const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    // this.timeout(5000);
    suite("POST request to /api/solve", function(){
        test("Solve a puzzle with valid puzzle string", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
                done()
            })
        })
        test("Solve a puzzle with missing puzzle string", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ""
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Required field missing')
                done()
            })
        })
        test("Solve a puzzle with invalid characters", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Invalid characters in puzzle')
                done()
            })
        })
        test("Solve a puzzle with incorrect length", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                done()
            })
        })
        test("Solve a puzzle that cannot be solved", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/solve")
            .send({
                puzzle: "3.6.......1.........4..3516..14...7.9.6.9.1.4.9...72..1356..4.........35......8.7"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, 'Puzzle cannot be solved')
                done()
            })
        })
    })
    suite("POST request to /api/check", function(){
        test("Check a puzzle placement with all fields", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                coordinate: "a1",
                value: "7"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, true)
                done()
            })
        })
        test("Check a puzzle placement with single placement conflict", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "6"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.deepEqual(res.body.conflict, ["column"])
                done()
            })
        })
        test("Check a puzzle placement with multiple placement conflicts", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "1"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.deepEqual(res.body.conflict, ["row","column"])
                done()
            })
        })
        test("Check a puzzle placement with all placement conflicts:", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "5"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.valid, false)
                assert.deepEqual(res.body.conflict, ["row","column", "region"])
                done()
            })
        })
        test("Check a puzzle placement with missing required fields", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "",
                value: ""
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field(s) missing")
                done()
            })
        })
        test("Check a puzzle placement with invalid characters", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "1"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle")
                done()
            })
        })
        test("Check a puzzle placement with incorrect length", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: ".9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "1"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                done()
            })
        })
        test("Check a puzzle placement with invalid placement coordinate", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "z1",
                value: "1"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid coordinate")
                done()
            })
        })
        test("Check a puzzle placement with invalid placement value", function(done){
            chai
            .request(server)
            .keepOpen()
            .post("/api/check")
            .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
                coordinate: "a1",
                value: "10"
            })
            .end(function(err, res){
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid value")
                done()
            })
        })
    })
});

