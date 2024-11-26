import { Cart } from "../../cart/models/cart.model";
import { Feedback } from "./Feedback";
import { Order } from "./order.model";
import { RefreshToken } from "./RefreshToken";

export interface User {
    id: string;
    userName: string;
    email: string;
    fullName?: string;
    address: string;
    refreshTokens: RefreshToken[];
    orders: Order[];
    cart: Cart;
    feedbacks: Feedback[];
}