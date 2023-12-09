import { Router } from "express";

const productsRouter = Router();
let products = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    },
    {
        id: 4
    }
];

productsRouter.get("/", (request, response) => {
    const {limit} = request.query;

    let productsToShow = [];
    const showAllProducts = !limit;

    if(showAllProducts){
        productsToShow = products;
    }
    else{
        for (let i = 0; i < products.length && i <= parseInt(limit) - 1; i++) {
            const element = products[i];
            productsToShow.push(element);
        }
    }

    response.send(productsToShow);
});

productsRouter.get("/:id", (request, response) => {
    const { id } = request.params;
    const element = products.find(item => item.id === parseInt(id));

    if(!element){
        return response.send("No product of id " + id + " found");
    }

    response.send(element);
});

productsRouter.post("/", (request, response) => {
    const product = request.body;
    const id = products.length + 1;
    products.push({...product, id});
    response.send("Product added.");
});

productsRouter.put("/:id", (request, response) => {
    const {id} = request.params;

    if (!products.some(item => item.id === parseInt(id))){
        response.send({error:"SE FUNO " + id});
    }

    const bodyProduct = request.body;
    const updatedProducts = products.map(product => {
        if(product.id === parseInt(id)){
            return {
                ...product,
                ...bodyProduct,
                id: parseInt(id)
            }
        }

        return product;
    });

    response.send("Updated product");
    products = updatedProducts;
});

productsRouter.delete("/:id", (request, response) => {
    const{id} = request.params;
    products = products.filter(product => product.id !== parseInt(id));
    response.send(id + " deleted");
});

export default productsRouter;