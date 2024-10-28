import { ActionTypes, CartType } from "@/types/types"
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useToast } from "@/hooks/use-toast"
const { toast } = useToast()

const INITIAL_STATE = {
    products: [],
    totalItems: 0,
    totalPrice: 0
}

export const userCartStore = create(
    persist<CartType & ActionTypes>(
        (set, get) => ({
            products: INITIAL_STATE.products,
            totalItems: INITIAL_STATE.totalItems,
            totalPrice: INITIAL_STATE.totalPrice,
            addToCart(item) {
                const products = get().products
                const productInState = products.find(product => product.id === item.id)

                if (productInState) {
                    const updateProduct = products.map(product => product.id === productInState.id ? {
                        ...item,
                        quantity: item.quantity + product.quantity,
                        price: item.price + product.price
                    }
                        : item
                    );
                    set((state) => ({
                        products: updateProduct,
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price
                    }))
                } else {
                    set((state) => ({
                        products: [...state.products, item],
                        totalItems: state.totalItems + item.quantity,
                        totalPrice: state.totalPrice + item.price
                    }));
                    toast({
                        title: `${item.title} added to cart`,
                        description: `${item.quantity} x ${item.price}`
                    })
                }
            },
            removeFromCart(item) {
                set((state) => ({
                    products: state.products.filter((product) => product.id !== item.id),
                    totalItems: state.totalItems - item.quantity,
                    totalPrice: state.totalPrice - item.price
                }))
                toast({
                    description: `${item.title} removed from cart`
                })
            },
            clearCart: () => set({ products: [] }),
        }),
        {
            name: "cart-storage", // unique name
        }
    )
);
