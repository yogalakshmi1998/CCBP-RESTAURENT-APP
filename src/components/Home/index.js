import {useState, useEffect, useCallback, useMemo} from 'react'
import PropTypes from 'prop-types'
import Header from '../Header'
import DishItem from '../DishItem'

import './index.css'

const API_URL = 'https://run.mocky.io/v3/77a7e71b-804a-4fbd-822c-3e365d3482cc'

const Home = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState([])
  const [activeCategoryId, setActiveCategoryId] = useState('')
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cartItems')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  const addItemToCart = useCallback(dish => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.dishId === dish.dishId)
      if (!existingItem) {
        return [...prev, {...dish, quantity: 1}]
      }
      return prev.map(item =>
        item.dishId === dish.dishId
          ? {...item, quantity: item.quantity + 1}
          : item
      )
    })
  }, [])

  const removeItemFromCart = useCallback(dish => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.dishId === dish.dishId)
      if (!existingItem) return prev
      
      return prev
        .map(item =>
          item.dishId === dish.dishId
            ? {...item, quantity: item.quantity - 1}
            : item
        )
        .filter(item => item.quantity > 0)
    })
  }, [])

  const getUpdatedData = tableMenuList =>
    tableMenuList.map(eachMenu => ({
      menuCategory: eachMenu.menu_category,
      menuCategoryId: eachMenu.menu_category_id,
      menuCategoryImage: eachMenu.menu_category_image,
      categoryDishes: eachMenu.category_dishes.map(eachDish => ({
        dishId: eachDish.dish_id,
        dishName: eachDish.dish_name,
        dishPrice: eachDish.dish_price,
        dishImage: eachDish.dish_image,
        dishCurrency: eachDish.dish_currency,
        dishCalories: eachDish.dish_calories,
        dishDescription: eachDish.dish_description,
        dishAvailability: eachDish.dish_Availability,
        dishType: eachDish.dish_Type,
        addonCat: eachDish.addonCat,
      })),
    }))

  const fetchRestaurantApi = async (signal) => {
    try {
      setIsLoading(true)
      setError(null)
      const apiResponse = await fetch(API_URL, { signal })
      if (!apiResponse.ok) {
        throw new Error('Failed to fetch menu data')
      }
      const data = await apiResponse.json()
      if (!data?.[0]?.table_menu_list) {
        throw new Error('Invalid data format')
      }
      const updatedData = getUpdatedData(data[0].table_menu_list)
      setResponse(updatedData)
      setActiveCategoryId(updatedData[0]?.menuCategoryId || '')
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
        console.error('Error fetching menu:', err)
      }
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const abortController = new AbortController()
    fetchRestaurantApi(abortController.signal)
    return () => abortController.abort()
  }, [])

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(cartItems))
    } catch (err) {
      console.error('Error saving cart items:', err)
    }
  }, [cartItems])

  const onUpdateActiveCategoryIdx = useCallback(menuCategoryId => {
    setActiveCategoryId(menuCategoryId)
  }, [])

  const renderTabMenuList = useCallback(() => {
    return response.map(eachCategory => {
      const isActive = eachCategory.menuCategoryId === activeCategoryId
      return (
        <li
          className={`each-tab-item ${isActive ? 'active-tab-item' : ''}`}
          key={eachCategory.menuCategoryId}
          role="presentation"
        >
          <button
            type="button"
            className="mt-0 mb-0 ms-2 me-2 tab-category-button"
            onClick={() => onUpdateActiveCategoryIdx(eachCategory.menuCategoryId)}
            aria-pressed={isActive}
            aria-label={`Show ${eachCategory.menuCategory} menu`}
          >
            {eachCategory.menuCategory}
          </button>
        </li>
      )
    })
  }, [response, activeCategoryId, onUpdateActiveCategoryIdx])

  const renderDishes = () => {
    const activeCategory = response.find(
      eachCategory => eachCategory.menuCategoryId === activeCategoryId,
    )
    
    if (!activeCategory) {
      return null
    }

    const {categoryDishes} = activeCategory

    return (
      <ul className="m-0 d-flex flex-column dishes-list-container">
        {categoryDishes.map(eachDish => (
          <DishItem
            key={eachDish.dishId}
            dishDetails={eachDish}
            cartItems={cartItems}
            addItemToCart={addItemToCart}
            removeItemFromCart={removeItemFromCart}
          />
        ))}
      </ul>
    )
  }

  const renderSpinner = () => (
    <div className="spinner-container" role="alert" aria-busy="true">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )

  const renderError = () => (
    <div className="spinner-container" role="alert">
      <div className="text-danger">
        <h2>Error Loading Menu</h2>
        <p>{error}</p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={fetchRestaurantApi}
        >
          Retry
        </button>
      </div>
    </div>
  )

  if (isLoading) {
    return renderSpinner()
  }

  if (error) {
    return renderError()
  }

  return (
    <div className="home-background">
      <Header cartItems={cartItems} />
      <nav aria-label="Menu Categories">
        <ul className="m-0 ps-0 d-flex tab-container" role="tablist">
          {renderTabMenuList()}
        </ul>
      </nav>
      <main>
        {renderDishes()}
      </main>
    </div>
  )
}

Home.propTypes = {
  // This component doesn't receive any props, but we'll add this for documentation
}

export default Home
