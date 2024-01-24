import './index.css'
import PropTypes from 'prop-types'

const DishItem = ({
  dishDetails,
  cartItems,
  addItemToCart,
  removeItemFromCart,
}) => {
  const {
    dishId,
    dishName,
    dishType,
    dishPrice,
    dishCurrency,
    dishDescription,
    dishImage,
    dishCalories,
    addonCat,
    dishAvailability,
  } = dishDetails

  const onIncreaseQuantity = () => addItemToCart(dishDetails)
  const onDecreaseQuantity = () => removeItemFromCart(dishDetails)

  const getQuantity = () => {
    const cartItem = cartItems.find(item => item.dishId === dishId)
    return cartItem ? cartItem.quantity : 0
  }

  const renderControllerButton = () => (
    <div className="controller-container d-flex align-items-center bg-success">
      <button 
        className="button" 
        type="button" 
        onClick={onDecreaseQuantity}
        aria-label={`Decrease quantity of ${dishName}`}
      >
        -
      </button>
      <p className="quantity" role="status" aria-live="polite">{getQuantity()}</p>
      <button 
        className="button" 
        type="button" 
        onClick={onIncreaseQuantity}
        aria-label={`Increase quantity of ${dishName}`}
      >
        +
      </button>
    </div>
  )

  return (
    <li className="mb-3 p-3 dish-item-container d-flex">
      <div
        className={`veg-border ${dishType === 1 ? 'non-veg-border' : ''} me-3`}
      >
        <div className={`veg-round ${dishType === 1 ? 'non-veg-round' : ''}`} />
      </div>
      <div className="dish-details-container">
        <h1 className="dish-name">{dishName}</h1>
        <p className="dish-currency-price">
          {dishCurrency} {dishPrice}
        </p>
        <p className="dish-description">{dishDescription}</p>
        {dishAvailability && renderControllerButton()}
        {!dishAvailability && (
          <p className="not-availability-text text-danger">Not available</p>
        )}
        {addonCat.length !== 0 && (
          <p className="addon-availability-text">Customizations available</p>
        )}
      </div>

      <p className="dish-calories text-warning">{dishCalories} calories</p>
      <img className="dish-image" alt={dishName} src={dishImage} />
    </li>
  )
}

DishItem.propTypes = {
  dishDetails: PropTypes.shape({
    dishId: PropTypes.string.isRequired,
    dishName: PropTypes.string.isRequired,
    dishType: PropTypes.number.isRequired,
    dishPrice: PropTypes.number.isRequired,
    dishCurrency: PropTypes.string.isRequired,
    dishDescription: PropTypes.string.isRequired,
    dishImage: PropTypes.string.isRequired,
    dishCalories: PropTypes.number.isRequired,
    addonCat: PropTypes.array.isRequired,
    dishAvailability: PropTypes.bool.isRequired,
  }).isRequired,
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      dishId: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  addItemToCart: PropTypes.func.isRequired,
  removeItemFromCart: PropTypes.func.isRequired,
}

export default DishItem
