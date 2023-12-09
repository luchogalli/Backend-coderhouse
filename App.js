import express from "express"
import cartRouter from "./Carts.js"
import productsRouter from "./Products.js"

const server = express();
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use("/api/carts", cartRouter);
server.use("/api/products", productsRouter);

const port = "8080";
server.listen(port, () => {
    console.log("Escuchando al port " + port + ", coder");
});