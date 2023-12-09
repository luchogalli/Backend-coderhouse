import { Router } from "express";
import fs from 'fs/promises';

const cartRouter = Router();
const CARTS_FILE = 'carts.json';

async function readCarts() {
    try {
        const data = await fs.readFile(CARTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Error reading file:', err);
        return [];
    }
}

async function writeCarts(carts) {
    try {
        await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
    }
}

cartRouter.get("/:id", async (request, response) => {
    const { id } = request.params;
    const carts = await readCarts();
    const cart = carts.find(item => item.id === parseInt(id));

    if (!cart) {
        return response.status(404).send("No cart of id " + id + " found");
    }

    response.send(cart.products);
});

cartRouter.get("/", async (request, response) => {
    const carts = await readCarts();
    response.send(carts);
});

cartRouter.post("/", async (request, response) => {
    const newCart = request.body;
    const carts = await readCarts();
    const id = carts.length + 1;
    carts.push({ ...newCart, id });
    await writeCarts(carts);
    response.send("Cart added.");
});

cartRouter.post("/:cartId/products/:productId", async (request, response) => {
    const { cartId, productId } = request.params;
    const carts = await readCarts();
    const requestedCart = carts.find(item => item.id === parseInt(cartId));

    if (!requestedCart) {
        return response.status(404).send("No cart of id " + cartId + " found");
    }

    const productIndex = requestedCart.products.findIndex(item => item.product === parseInt(productId));

    if (productIndex === -1) {
        requestedCart.products.push({ product: parseInt(productId), quantity: 1 });
    } else {
        requestedCart.products[productIndex].quantity++;
    }

    await writeCarts(carts);
    response.send("Updated cart");
});

export default cartRouter;
