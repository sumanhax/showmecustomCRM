import React from "react";

import { PieChart, Pie, Legend, Tooltip } from "recharts";

const data01 = [
  { name: "Orders", value: 70 },
  { name: "Cancellation", value: 50 },
  { name: "Refund", value: 10 },
];

const OrderStatus = () => {
  return (
    <div>
      <PieChart width={345} height={345}>
        <Pie
          dataKey="value"
          isAnimationActive={false}
          data={data01}
          cx={200}
          cy={200}
          outerRadius={80}
          fill="#8884d8"
          label
        />
        <Tooltip />
      </PieChart>
    </div>
  );
};

export default OrderStatus;
