import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import md5 from 'md5';
import axios from 'axios';

const API_KEY = "Valantis"
const API_URL = "https://api.valantis.store:41000"

let date = new Date(Date.UTC(
  new Date().getUTCFullYear(),
  new Date().getUTCMonth(),
  new Date().getUTCDate()
)).toISOString().replace(/T00:00:00.000Z|-/g, "")

const PASSWORD = md5(API_KEY + "_" + date)

export const getIdsAPI = async (offset,  limit) => {
  return await axios({ 
    method: 'post', 
    url: API_URL,
    headers: {
      "X-Auth": PASSWORD,
    },
    data: {
      "action": "get_ids",
      "params": {"offset": offset, "limit": limit}
    }
  })
}

export const getItemsAPI = async (ids) => {
  return await axios({ 
    method: 'post', 
    url: API_URL,
    headers: {
      "X-Auth": PASSWORD,
    },
    data: {
      "action": "get_items",
      "params": {"ids": ids}
    }
  })
}

export const getFieldsAPI = async () => {
  return await axios({
    method: 'post',
    url: API_URL,
    headers: {
      "X-Auth": PASSWORD,
    },
    data: {
      "action": "get_fields",
    }
  })
}

export const getBrandsAPI = async () => {
  return await axios({
    method: 'post',
    url: API_URL,
    headers: {
      "X-Auth": PASSWORD,
    },
    data: {
      "action": "get_fields",
      "params": {"field": "brand"}
    }
  })
}

export const filterIdsAPI = async (parameter) => {
  return await axios({
    method: 'post',
    url: API_URL,
    headers: {
      "X-Auth": PASSWORD,
    },
    data: {
      "action": "filter",
      "params": parameter
    }
  })
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <App />
);

