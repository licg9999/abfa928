import { FC, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Provider as ReduxProvider } from 'react-redux';
import { combineReducers, createStore } from 'redux';
import { SpreadoSetupProvider, useSpreadIn, useSpreadOut } from 'spreado';
import {
  spreadoReduxReducerPack,
  SpreadoSetupForReduxReactQuery,
} from 'spreado/for-redux-react-query';
import {
  getDealList,
  GetDealListRequest,
  PaymentStatusDisplays,
  PaymentStatusValues,
  SupportedRegions,
} from '../services/dealList';

const INDEX_OF_DEAL_LIST_QUERY = 'INDEX_OF_DEAL_LIST_QUERY';

function useDealListQuerySpreadOut(request: GetDealListRequest) {
  return useSpreadOut(
    INDEX_OF_DEAL_LIST_QUERY,
    useQuery([INDEX_OF_DEAL_LIST_QUERY, request], () => getDealList(request))
  );
}

function useDealListQuerySpreadIn() {
  return useSpreadIn<ReturnType<typeof useDealListQuerySpreadOut>>(INDEX_OF_DEAL_LIST_QUERY, {});
}

const ComponentA: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(SupportedRegions[0]);

  const { isLoading, isSuccess, data } = useDealListQuerySpreadOut({ region: selectedRegion });

  return (
    <div>
      <div>
        <label>Please select a region: </label>
        <select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          {SupportedRegions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <table>
          {data.list.map(({ id, address, closePrice, paymentStatus }) => (
            <tr>
              <td>ID: {id}</td>
              <td>Address: {address}</td>
              <td>Close Price: {closePrice}</td>
              <td>Payment Status: {PaymentStatusDisplays[paymentStatus]}</td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
};

const ComponentB: FC = () => {
  const { isLoading, isSuccess, data } = useDealListQuerySpreadIn();

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isSuccess && (
        <div>
          Total count: {data?.totalCount}. Fetched count: {data?.list.length} (
          {PaymentStatusValues.map(
            (v) =>
              `${PaymentStatusDisplays[v]}: ${
                data?.list.filter((item) => item.paymentStatus === v).length
              }`
          )}
          )
        </div>
      )}
    </div>
  );
};

const store = createStore(combineReducers(spreadoReduxReducerPack));
const queryClient = new QueryClient();
const spreadoSetup = new SpreadoSetupForReduxReactQuery({ store, queryClient });

export const SpreadoExample: FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <SpreadoSetupProvider setup={spreadoSetup}>
          <div>
            <ComponentA />
            <ComponentB />
          </div>
        </SpreadoSetupProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
