import { useDispatch, useSelector } from 'react-redux';
import { setGists, setGistsError } from 'src/redux/slices/gists';
import { AppThunk } from 'src/redux/Store';
import { GITHUB_API } from '../config';


interface GetGistsParams {
  page?: number;
  inPage?: number;
  since?: Date;
}

export const getGists = (params: GetGistsParams = {}): AppThunk => async (
  dispatch
) => {
   
  const { page = 0, inPage = 10, since } = params; 
  console.log("result", page * inPage);
  
  let url = `${GITHUB_API}/gists/public?page=${page}&per_page=${inPage}`;

  if (since) { 
    url += `&since=${since.toISOString()}`;
  }

  const headers = new Headers({
    Accept: 'application/vnd.github.v3+json',
  });

  try {
    const response = await fetch(url, { headers });
    const json = await response.json();
    if(response.status === 200 && Array.isArray(json)) {    
        dispatch(setGists(json));
    } else {
      // throw error для таких ошибок как 404 
      throw Error;
    }
  } catch (error) { 
    dispatch(setGistsError("Sorry, something went wrong, please call us +7(XXX)XXXXXXX"));
  }
};
