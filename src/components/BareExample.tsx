import produce from 'immer';
import { FC, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { Provider as ReduxProvider, useDispatch, useSelector } from 'react-redux';
import { Action, createStore } from 'redux';
import {
  getDealList,
  GetDealListRequest,
  PaymentStatusDisplays,
  PaymentStatusValues,
  SupportedRegions,
} from '../services/dealList';

interface TheState {
  dealListQuery: Partial<ReturnType<typeof useDealListQuery>>;
}

const initialTheState: TheState = {
  dealListQuery: {},
};

const SET_DEAL_LIST_QUERY = 'BARE_EXAMPLE/SET_DEAL_LIST_QUERY';

interface TheAction extends Action, Partial<TheState> {}

function setDealListQuery(dealListQuery: Partial<ReturnType<typeof useDealListQuery>>): TheAction {
  return { type: SET_DEAL_LIST_QUERY, dealListQuery };
}

function reducer(state: TheState = initialTheState, action: TheAction): TheState {
  return produce(state, (draft) => {
    switch (action.type) {
      case SET_DEAL_LIST_QUERY:
        draft.dealListQuery = action.dealListQuery ?? {};
        break;
    }
  });
}

function useDealListQuery(request: GetDealListRequest) {
  return useQuery(['bare_example/deal_list_query', request], () => getDealList(request));
}

const ComponentA: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(SupportedRegions[0]);

  const queryResult = useDealListQuery({ region: selectedRegion });
  const { isLoading, isSuccess, data } = queryResult;

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setDealListQuery(queryResult));
    return () => {
      dispatch(setDealListQuery({}));
    };
  }, [dispatch, queryResult]);

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
  const { isLoading, isSuccess, data } = useSelector<TheState, TheState['dealListQuery']>(
    (state) => state.dealListQuery
  );
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

const store = createStore(reducer);
const queryClient = new QueryClient();

export const BareExample: FC = () => {
  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <div>
          <ComponentA />
          <ComponentB />
        </div>
      </QueryClientProvider>
    </ReduxProvider>
  );
};
