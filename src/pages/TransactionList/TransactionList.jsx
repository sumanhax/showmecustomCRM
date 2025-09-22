import { Pagination, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  getTransaction,
  getWallet,
  giveCredits,
} from "../../Reducer/WalletSlice";
import { toast } from "react-toastify";

const TransactionList = () => {
  const { transactionHistoryData, wallet } = useSelector(
    (state) => state?.transactions
  );
  const [totalPage, setTotalPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const id = useParams();
  useEffect(() => {
    dispatch(getWallet({ id: id?.id }));
    dispatch(getTransaction({ page: currentPage, limit: 10, id: id?.id })).then(
      (res) => {
        console.log("Res", res);
        const total = res?.payload?.total_page;
        setTotalPage(Number.isInteger(total) && total > 0 ? total : 1);
      }
    );
  }, [currentPage, limit]);
  const handleCredit = (transcation_id, user_id, id) => {
    dispatch(
      giveCredits({
        id: wallet?.data?.[0]?.id,
        user_id: user_id,
        transaction_id: transcation_id,
      })
    ).then((res) => {
      console.log("Response", res);
      if (res?.payload?.status_code === 200) {
        toast.success(res?.payload?.messsage);
        dispatch(
          getTransaction({ page: currentPage, limit: 10, id: user_id })
        ).then((res) => {
          console.log("Res", res);
          const total = res?.payload?.total_page;
          setTotalPage(Number.isInteger(total) && total > 0 ? total : 1);
        });
      }
    });
  };
  const onPageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {" "}
      <div>
        <div className="bg-white rounded-2xl p-5 lg:p-10 mb-4">
          <div className="lg:flex w-full gap-8 mb-4 lg:mb-0">
            <div className="lg:w-full bg-white border border-[#e6e6e6] p-6 rounded-2xl">
              <h3 className="text-[#5e6161] text-xl font-medium pb-6">
                History
              </h3>
              <div className="table_area">
                <div className="overflow-x-auto">
                  <Table hoverable className="relative">
                    <Table.Head>
                      <Table.HeadCell>Date</Table.HeadCell>
                      <Table.HeadCell>Amount</Table.HeadCell>
                      <Table.HeadCell>Credit</Table.HeadCell>
                      <Table.HeadCell>Transaction Type</Table.HeadCell>
                      <Table.HeadCell>Transaction Id</Table.HeadCell>
                      <Table.HeadCell>&nbsp;Status</Table.HeadCell>
                      <Table.HeadCell>Credit</Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                      {transactionHistoryData?.data?.map((his) => {
                        const formattedDate = new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        }).format(new Date(his.created_at));
                        return (
                          <>
                            <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                              <Table.Cell>{formattedDate}</Table.Cell>
                              <Table.Cell>${his?.total_balance}</Table.Cell>
                              <Table.Cell>{his?.total_credit}</Table.Cell>
                              <Table.Cell>{his?.transaction_type}</Table.Cell>
                              <Table.Cell>{his?.payment_intend}</Table.Cell>
                              <Table.Cell>
                                {his?.transaction_success === "success" ? (
                                  <button className="font-medium bg-[#2de449] text-white py-2 px-4 rounded-md text-xs">
                                    {his?.transaction_success}
                                  </button>
                                ) : his?.transaction_success === "pending" ? (
                                  <button className="font-medium bg-[#fbd53b] text-white py-2 px-4 rounded-md text-xs">
                                    {his?.transaction_success}
                                  </button>
                                ) : his?.transaction_success === "initiate" ? (
                                  <button className="font-medium bg-[#3d3be0] text-white py-2 px-4 rounded-md text-xs">
                                    {his?.transaction_success}
                                  </button>
                                ) : (
                                  <button className="font-medium bg-[#f13333] text-white py-2 px-4 rounded-md text-xs">
                                    {his?.transaction_success}
                                  </button>
                                )}
                              </Table.Cell>
                              <Table.Cell>
                                {(his?.transaction_success === "pending" ||
                                  his?.transaction_success === "failed") && (
                                  <button
                                    onClick={() =>
                                      handleCredit(
                                        his?.id,
                                        his?.user_id,
                                        his?.plan_id
                                      )
                                    }
                                    className="bg-pink-700  p-2 rounded-lg text-white"
                                  >
                                    Credit
                                  </button>
                                )}
                              </Table.Cell>
                            </Table.Row>
                          </>
                        );
                      })}
                    </Table.Body>
                  </Table>
                </div>
                {transactionHistoryData?.total_page > 1 && (
                  <>
                    <div className="flex justify-center items-center mt-4 pagination_sec">
                      <Pagination
                        layout="pagination"
                        currentPage={currentPage}
                        totalPages={totalPage}
                        onPageChange={onPageChange}
                        previousLabel=""
                        nextLabel=""
                        showIcons
                      />
                    </div>
                  </>
                )}
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
export default TransactionList;
