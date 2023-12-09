import { Router } from "express";

const cartRouter = Router();
const carts = [
    {
        id: 1,
        products: [
            {
                product: 1,
                quantity: 5
            },
            {
                product: 2,
                quantity: 2
            }
        ]
    },
    {
        id: 2,
        products: [
            {
                product: 3,
                quantity: 1
            },
            {
                product: 9,
                quantity: 1
            }
        ]
    },
];

cartRouter.get("/:id", (request, response) => {
    const { id } = request.params;
    const cart = carts.find(item => item.id === parseInt(id));

    if (!cart) {
        return response.status(404).send("No cart of id " + id + " found");
    }

    response.send(cart.products);
});

cartRouter.get("/", (request, response) => {
    response.send(carts);
});

cartRouter.post("/", (request, response) => {
    const newCart = request.body;
    const id = carts.length + 1;
    carts.push({ ...newCart, id });
    response.send("Cart added.");
});

cartRouter.post("/:cartId/products/:productId", (request, response) => {
    const { cartId, productId } = request.params;

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

    response.send("Updated cart");
});

export default cartRouter;