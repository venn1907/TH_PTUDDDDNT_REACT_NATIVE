import {createContext, useContext, useReducer, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {categories} from '../data/categories';
import {foodItems} from '../data/foodItems';

const initialState = {
  user: null,
  isAuthenticated: false,
  categories: categories,
  foodItems: [],
  cart: [],
  orders: [],
  loading: false,
  error: null,
};

const AppContext = createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: action.payload !== null,
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_FOOD_ITEMS':
      return {
        ...state,
        foodItems: action.payload,
      };
    case 'SET_CART':
      return {
        ...state,
        cart: action.payload,
      };
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(
        item => item.id === action.payload.id,
      );
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? {...item, quantity: item.quantity + 1}
              : item,
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, {...action.payload, quantity: 1}],
        };
      }
    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload),
      };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? {...item, quantity: action.payload.quantity}
            : item,
        ),
      };
    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [action.payload, ...state.orders],
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

export const AppContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      dispatch({type: 'SET_USER', payload: user});

      if (user) {
        fetchUserCart(user.uid);
        fetchUserOrders(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (state.user && state.cart.length >= 0) {
      syncCartWithFirebase(state.user.uid, state.cart);
    }
  }, [state.user, state.cart]);

  const fetchUserCart = async userId => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const cartDoc = await firestore()
        .collection('users')
        .doc(userId)
        .collection('cart')
        .doc('current')
        .get();

      if (cartDoc.exists) {
        const cartData = cartDoc.data();
        dispatch({type: 'SET_CART', payload: cartData?.items || []});
      }

      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const syncCartWithFirebase = async (userId, cart) => {
    try {
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('cart')
        .doc('current')
        .set({
          items: cart,
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
    } catch (error) {
      console.error('Error syncing cart:', error);
      dispatch({type: 'SET_ERROR', payload: error.message});
    }
  };

  const fetchUserOrders = async userId => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const ordersSnapshot = await firestore()
        .collection('users')
        .doc(userId)
        .collection('orders')
        .orderBy('createdAt', 'desc')
        .get();

      const ordersData = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt
          ? doc.data().createdAt.toDate()
          : new Date(),
      }));

      dispatch({type: 'SET_ORDERS', payload: ordersData});
      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      console.error('Error fetching orders:', error);
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const saveOrder = async (orderItems, orderTotal) => {
    try {
      if (!state.user) {
        throw new Error('User must be logged in to place an order');
      }

      dispatch({type: 'SET_LOADING', payload: true});

      const orderData = {
        items: orderItems,
        total: orderTotal,
        status: 'completed',
        createdAt: firestore.FieldValue.serverTimestamp(),
      };

      const orderRef = await firestore()
        .collection('users')
        .doc(state.user.uid)
        .collection('orders')
        .add(orderData);

      const newOrder = {
        id: orderRef.id,
        ...orderData,
        createdAt: new Date(),
      };

      dispatch({type: 'ADD_ORDER', payload: newOrder});

      await firestore()
        .collection('users')
        .doc(state.user.uid)
        .collection('cart')
        .doc('current')
        .set({
          items: [],
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });

      dispatch({type: 'CLEAR_CART'});
      dispatch({type: 'SET_LOADING', payload: false});

      return newOrder;
    } catch (error) {
      console.error('Error saving order:', error);
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
      throw error;
    }
  };

  const fetchFoodItemsByCategory = async categoryId => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});

      const filteredItems = foodItems.filter(
        item => item.categoryId === categoryId,
      );

      dispatch({type: 'SET_FOOD_ITEMS', payload: filteredItems});
      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const signIn = async (email, password) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      await auth().signInWithEmailAndPassword(email, password);
      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const signUp = async (email, password, username) => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );

      await firestore().collection('users').doc(userCredential.user.uid).set({
        username,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const signOut = async () => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      await auth().signOut();
      dispatch({type: 'SET_CART', payload: []});
      dispatch({type: 'SET_ORDERS', payload: []});
      dispatch({type: 'SET_LOADING', payload: false});
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
    }
  };

  const resetPassword = async email => {
    try {
      dispatch({type: 'SET_LOADING', payload: true});
      await auth().sendPasswordResetEmail(email);
      dispatch({type: 'SET_LOADING', payload: false});
      return true;
    } catch (error) {
      dispatch({type: 'SET_ERROR', payload: error.message});
      dispatch({type: 'SET_LOADING', payload: false});
      return false;
    }
  };

  const calculateCartTotal = () => {
    const itemsTotal = state.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
    const taxes = itemsTotal * 0.08;
    const deliveryCharges = 30;
    const discount = itemsTotal > 1000 ? 18 : 0;

    return {
      itemsTotal,
      taxes,
      deliveryCharges,
      discount,
      total: itemsTotal + taxes + deliveryCharges - discount,
    };
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        dispatch,
        signIn,
        signUp,
        signOut,
        resetPassword,
        fetchFoodItemsByCategory,
        calculateCartTotal,
        saveOrder,
        fetchUserOrders,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
