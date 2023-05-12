export const expressServer = `
    const app = express();
    app.get('/', (req, res) => {
        res.send("welcome to mockapi");
    });
    app.listen(3002, () => {console.log("server started at port 3002")});
`;
