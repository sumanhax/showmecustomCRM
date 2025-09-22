import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getWallet, walletFriz } from "../../Reducer/WalletSlice";
import { useParams } from "react-router-dom";

const Wallet = () => {
  const { wallet } = useSelector((state) => state?.transactions);
  const id = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getWallet({ id: id?.id }));
  }, []);
  console.log("Wallet", wallet);
  const handleAccountFriz = (id, userId) => {
    dispatch(walletFriz({ id: id, user_id: userId })).then((res) => {
      console.log("Res", res);
      if (res?.payload?.status_code === 200) {
        dispatch(getWallet({ id: userId }));
      }
    });
  };
  return (
    <>
      <div>
        {/* <ToastContainer /> */}
        <div>
          <div className="lg:flex justify-between items-center w-full mb-4">
            <div className="lg:w-6/12 mb-2 lg:mb-2">
              <h2 className="text-[#262626] text-2xl font-semibold lg:pb-2">
                Wallet
              </h2>
              <p className="text-[#8d8686] text-base">
                Wallet and payment information
              </p>
            </div>
          </div>
          {/*  */}
          <div className="lg:flex w-full gap-8 mb-8">
            <div className="lg:w-6/12 bg-white border border-[#e6e6e6] p-6 mb-4 lg:mb-0">
              <h3 className="text-[#5e6161] text-xl font-medium pb-1">
                Credits
              </h3>
              <p className="text-[#7c8183] text-sm">
                Balance updates may take up to one hour to reflect recent usage
              </p>
              <div className="flex mt-6">
                <div className="border-r border-[#ebebeb] py-1 pr-4">
                  <p className="text-[#7c8183] text-base pb-1">
                    Current Tokens
                  </p>
                  <h4 className="text-[#5e6161] text-3xl font-medium">
                    {wallet?.data?.length > 0 ? wallet?.data?.[0]?.balance : 0}
                  </h4>
                </div>
                <div className="pl-4">
                  <p className="text-[#7c8183] text-base pb-1">
                    {wallet?.data?.[0]?.account_frize === 0 ? (
                      <>
                        <button
                          onClick={() =>
                            handleAccountFriz(
                              wallet?.data?.[0]?.id,
                              wallet?.data?.[0]?.user_id
                            )
                          }
                          className="font-medium bg-[#2de449] text-white py-2 px-4 rounded-md text-xs"
                        >
                          Active
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            handleAccountFriz(
                              wallet?.data?.[0]?.id,
                              wallet?.data?.[0]?.user_id
                            )
                          }
                          className="font-medium bg-[#f13232] text-white py-2 px-4 rounded-md text-xs"
                        >
                          Banned
                        </button>
                      </>
                    )}{" "}
                  </p>
                  {/* <h4 className="text-[#5e6161] text-3xl font-medium">$6.61</h4> */}
                  {parseInt(wallet?.data?.[0]?.is_free) === 0 ? (
                    <h1 className="text-[#5e6161] text-sm font-medium">
                      Paid Account
                    </h1>
                  ) : (
                    <h1 className="text-[#5e6161] text-sm font-medium">
                      Free Account
                    </h1>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/*  */}
          {/*  */}

          {/*  */}
        </div>
      </div>
    </>
  );
};
export default Wallet;
