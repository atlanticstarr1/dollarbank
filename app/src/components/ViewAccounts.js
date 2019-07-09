import React from "react";
import useBankContract from "../utils/useBankContract";
import { Table, EthAddress, Blockie } from "rimble-ui";

const ViewAccounts = props => {
  const { bankAccounts } = useBankContract();

  return (
    <Table>
      <thead>
        <tr>
          <th>Accounts ({bankAccounts && bankAccounts.length})</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {bankAccounts &&
          bankAccounts.map(a => (
            <tr key={a}>
              <td>
                <EthAddress address={a} />
              </td>
              <td style={{ textAlign: "center" }}>
                <Blockie
                  opts={{
                    seed: a
                  }}
                />
              </td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default ViewAccounts;
