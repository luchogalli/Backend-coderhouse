import { Router } from "express";

const cartRouter = Router();
const carts = [
    {
        id: 1,
        products: [
            1,
            2,
            3,
            4,
            5,
            6
        ]
    },
    {
        id: 2,
        products: [
            1,
            2,
            3,
            4
        ]
    }
];

cartRouter.get("/:id", (request, response) => {
    const { id } = request.params;
    const element = carts.find(item => item.id === parseInt(id));

    if(!element){
        return response.send("No cart of id " + id + " found");
    }

    response.send(element.products);
});

cartRouter.post("/", (request, response) => {
    const cart = request.body;
    const id = carts.length + 1;
    carts.push({...cart, id});
    response.send("cart added.");
});

cartRouter.post("/:cartId/products/:productId", (request, response) => {
    const cart = request.body;
    const id = carts.length + 1;
    carts.push({...cart, id});
    response.send("cart added.");
});

export default cartRouter;