import axios from "axios";
import { useEffect } from "react";
import { Card } from "./components/Card";
import { useInfiniteQuery } from "react-query";
import { CountryCode, QueryRes, ResponseModel } from "./types";

const CustomAxios = axios.create({
  baseURL: "http://localhost:3001",
});

const states: CountryCode[] = ['AL', 'AK', 'AS', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FM', 'FL', 'GA', 'GU', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MH', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'MP', 'OH', 'OK', 'OR', 'PW', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VI', 'VA', 'WA', 'WV', 'WI', 'WY'];

export const App = () => {

  const getData = async (page: number): Promise<QueryRes> => {
    const senators = await (await CustomAxios.get<ResponseModel>(`/senators/${states[page]}`)).data.results;
    const reps = await (await CustomAxios.get<ResponseModel>(`/representatives/${states[page]}`)).data.results;

    if (reps && senators) {
      return { pageNumber: page, data: [...senators, ...reps] }
    } else if (reps && !senators) {
      return { pageNumber: page, data: [...reps] }
    } else if (!reps && senators) {
      return { pageNumber: page, data: [...senators] }
    } else {
      return { pageNumber: page, data: [] }
    }
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching } = useInfiniteQuery(
    'representatives',
    {
      refetchOnWindowFocus: false,
      queryFn: async ({ pageParam = 0 }) => {
        return await getData(pageParam);
      },

      getNextPageParam: (lastPage) => {
        return lastPage.pageNumber !== states.length - 1 ? lastPage.pageNumber + 1 : undefined
      },
      onError: (err) => {
        console.error(err);
      },
    }

  );
  useEffect(() => {
    let fetching = false;
    const onScroll = async (event: any) => {
      const { scrollHeight, scrollTop, clientHeight } =
        event.target.scrollingElement;
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.5) {
        fetching = true;
        await fetchNextPage();
        fetching = false;
      }
    };

    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, [fetchNextPage]);

  return (
    <div className="container">
      <h1>Government Representatives</h1>
      {
        !data ? <div>...no results</div> :
          <div className="cards">
            {
              data.pages.map((page) => (
                page.data.map((rep) => (
                  <Card key={rep.name} rep={rep} />
                ))
              ))
            }
          </div>
      }
      {(isLoading || isFetching) && <h5 style={{ margin: 16 }}>...loading</h5>}
      {(!hasNextPage) && <h5 style={{ margin: 16 }}>END OF RESULTS</h5>}
    </div>
  )
};
