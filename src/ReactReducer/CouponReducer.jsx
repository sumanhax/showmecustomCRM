export const CouponReducerInitialState = {
  couponDetails: {
    couponList: [],
  },
};

export const CouponReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_COUPON':
      return {
        ...state,
        couponDetails: {
          ...state.couponDetails,
          ...action.payload,
        },
      };
  }
};
