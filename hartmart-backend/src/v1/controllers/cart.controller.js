import CartService from "../../services/cart.service.js";

const addToCart = async(req, res)=>{
    try{
        const item = await CartService.addToCart(req.user.id, req.body)
       res.status(201).json({
        success: "true",
        message: "Add product to shopping cart",
        data: item,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.message,
    });
  }
}

const getCart = async(req, res)=>{
    try {
      const cart = await CartService.getCart(req.user.id);

    res.status(200).json({
        success: true,
        data: cart,
    });
    } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Get user's shopping cart",
      error: error.message,
    });
  }
}

export{addToCart, getCart}