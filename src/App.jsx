import { useEffect, useState } from 'react';
import { filterIdsAPI, getBrandsAPI, getFieldsAPI, getIdsAPI, getItemsAPI } from '.';
import GoodsItem from './GoodsItem';
import Button from './Button';

function App() {

  const AMOUNT_GOODS = 50;

  const [ids, setIds] = useState([])
  const [amountPages, setAmountPages] = useState(0)
  const [groupIds, setGroupIds] = useState([0, AMOUNT_GOODS])
  const [itemsAcum, setItemsAcum] = useState([])
  const [goods, setGoods] = useState([])
  const [isNoGoods, setIsNoGoods] = useState(false)
  const [fields, setFields] = useState([])
  const [fieldFilter, setFieldFilter] = useState("product")
  const [valueFilter, setValueFilter] = useState("")
  const [brands, setBrands] = useState([])
  const [isFilter, setIsFilter] = useState(false)

  const getIds = () => {
    getIdsAPI()
      .then((response) => {
        setIds([...new Set(response.data.result)])
        if (response.data.result.length === 0) {
          setIsNoGoods(true)
        } else {
          setIsNoGoods(false)
        }
      })
      .catch((err) => {
        console.log(err)
        getIds()
      })
  }

  const getItems = () => {
    getItemsAPI(ids.slice(groupIds[0], groupIds[1]))
      .then((response) => {
        setItemsAcum([...itemsAcum, ...response.data.result]
          .reduce((o, i) => {
            if (!o.find(v => v.id === i.id)) o.push(i)
            return o
          }, [])
        )
      })
      .catch((err) => {
        console.log(err)
        getItems()
      })
  }

  const getFields = () => {
    getFieldsAPI()
      .then((response) => {
        setFields(response.data.result)
      })
      .catch((err) => {
        console.log(err)
        getFields()
      })
  }

  const getBrands = () => {
    getBrandsAPI()
      .then((response) => {
        setBrands([...new Set(response.data.result)])
      })
      .catch((err) => {
        console.log(err)
        getBrands()
      })
  }

  const filterIds = () => {
    setIds([])
    setItemsAcum([])
    setGoods([])
    filterIdsAPI({ [fieldFilter]: valueFilter })
      .then((response) => {
        if (response.data.result.length === 0) {
          setIsNoGoods(true)
        } else {
          setIsNoGoods(false)
        }
        setIds([...new Set(response.data.result)])
        setIsFilter(true)
      })
      .catch((err) => {
        console.log(err)
        filterIds()
      })
  }

  const prevGoods = () => {
    if (groupIds[0] > 0) {
      setGroupIds([groupIds[0] - AMOUNT_GOODS, groupIds[1] - AMOUNT_GOODS])
    }
  }

  const nextGoods = () => {
    if ((groupIds[1] <= itemsAcum.length)
      && ((groupIds[1] / AMOUNT_GOODS) < amountPages)) {
      setGroupIds([groupIds[0] + AMOUNT_GOODS, groupIds[1] + AMOUNT_GOODS])
      setGoods([])
    }
  }

  const filter = () => {
    if (valueFilter !== "" && valueFilter !== 0) {
      setGroupIds([0, AMOUNT_GOODS])
      filterIds()
    }
  }

  const clearFilter = () => {
    setFieldFilter("product")
    setValueFilter("")
    if (isFilter === true) {
      setGroupIds([0, AMOUNT_GOODS])
      setIds([])
      setItemsAcum([])
      setGoods([])
      getIds()
      setIsFilter(false)
    }
  }

  useEffect(() => {
    getIds()
    getFields()
    getBrands()
  }, [])

  useEffect(() => {
    setAmountPages(Math.ceil(ids.length / AMOUNT_GOODS))
    if (ids.length !== 0 && groupIds[1] === itemsAcum.length + AMOUNT_GOODS) {
      getItems()
    }
  }, [ids, groupIds])

  useEffect(() => {
    if (itemsAcum.length !== 0 && 1) {
      setGoods(itemsAcum.slice(groupIds[0], groupIds[1]))
    }
  }, [itemsAcum, groupIds])

  return (
    <div className='goods'>
      <div>
        <div className='goods__filter filter'>
          <div className='filter__title'>Фильтр</div>
          <div className="filter__body">
            <select
              className='filter__select'
              value={fieldFilter}
              onChange={(e) => {
                setValueFilter("")
                setFieldFilter(e.target.value)
              }}
            >
              {fields.map((q) => <option key={q} value={q}>{q}</option>)}
            </select>
            {fieldFilter === "brand"
              ? <select
                className='filter__selectBrand'
                onChange={(e) => { setValueFilter(e.target.value) }}
              >
                {brands.map((q) => <option key={q} value={q}>{q}</option>)}
              </select>
              : fieldFilter === "price"
                ? <input
                    className='filter__input'
                    type="number"
                    min="0"
                    value={valueFilter}
                    onChange={(e) => {setValueFilter(Number(e.target.value))}}
                  />
                : <input
                    className='filter__input'
                    type="text"
                    value={valueFilter}
                    onChange={(e) => {setValueFilter(e.target.value)}}
                  />
            }
            <Button onClick={() => filter()} text="Фильтровать" />
            <Button onClick={() => clearFilter()} text="Очистить" />
          </div>
        </div>
        <div className='goods__navigation navigation'>
          <div className='navigation__info'>
            Страница {groupIds[1] / AMOUNT_GOODS} из {amountPages}
          </div>
          <div className="navigation__buttons">
            <Button onClick={() => prevGoods()} text="Предыдущая" />
            <Button onClick={() => nextGoods()} text="Следующая" />
          </div>
        </div>
      </div>
      <div className='goods__items'>{isNoGoods === true
        ? <div className='goods__addedInfo'>Товаров нет!</div>
        : goods.length === 0
          ? <div className='goods__addedInfo'>Идет загрузка товаров! Подождите!</div>
          : goods.map((q) => (
            <GoodsItem
              key={q.id}
              id={q.id}
              brand={q.brand}
              price={q.price}
              product={q.product}
            />
          ))
      }
      </div>
    </div>
  );
}

export default App;
