import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { MdOutlineStar } from "react-icons/md";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const SingleProduct = () => {
  const [productList, setProductList] = useState([]);
  const [inCart, setInCart] = useState(false);
  const [count, setCount] = useState(1);
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://demo-wvl4.onrender.com/product/list/");
        setProductList(response.data);
      } catch (error) {
        alert("Failed to fetch products.");
      }
    };
    fetchData();
  }, []);

  const selectedProduct = productList.find((pro) => pro._id === id);

  const handleAddToCart = async () => {
  if (!user) {
    alert("Please login to add to cart.");
    return;
  }

  try {
    const cartPayload = {
      userId: user.id,
      date: new Date(),
      products: [
        {
          productId: selectedProduct._id,
          quantity: count,
        },
      ],
    };

    await axios.post("https://demo-wvl4.onrender.com/cart/insert/", cartPayload);
    setInCart(true);
    // alert("Added to cart!");
  } catch (err) {
    console.error("Cart insert error:", err);
    alert("Failed to add to cart.");
  }
};


  return (
    <div>
      {selectedProduct ? (
        <Container className="py-4">
          <Row className="justify-content-center align-items-center g-5">
            <Col md={5} xs={10}>
              <div
                style={{
                  height: "300px",
                  width: "100%",
                  boxShadow: "0 0px 10px #efefef",
                  padding: "20px",
                }} >
                <img
                  src={`https://demo-wvl4.onrender.com/public/${selectedProduct.image}`}
                  alt="Product"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
            </Col>
            <Col md={6} xs={11}>
              <h4 className="text-uppercase text-muted">{selectedProduct.category}</h4>
              <h5 className="fw-bold my-2">{selectedProduct.title}</h5>
              <p>
                <span className="fw-bold">₹{selectedProduct.price}</span>{" "}
                <del className="text-muted">₹{(selectedProduct.price + 3).toFixed(2)}</del>
              </p>

              <div className="mb-3">
                {!inCart ? (
                  <button onClick={handleAddToCart} className="subscribe">
                    Add to Cart
                  </button>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #ccc",
                      width: "fit-content",
                    }} >
                    <button
                      onClick={() => setCount((prev) => Math.max(prev - 1, 1))}
                      style={{ border: "none", fontWeight: "bold", background: "none" }} >
                      <h3 style={{ paddingLeft: "5px" }}>-</h3>
                    </button>

                    <span style={{ minWidth: "20px", textAlign: "center" }}>{count}</span>
                    <button
                      onClick={() => setCount((prev) => prev + 1)}
                      style={{ border: "none", padding: "0px 2px", fontWeight: "bold", background: "none" }} >
                      <h3 style={{ paddingRight: "5px" }}>+</h3>
                    </button>
                  </div>
                )}
              </div>

              {selectedProduct.rating && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div
                    style={{
                      backgroundColor: "#15803D",
                      color: "white",
                      padding: "3px 6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                    }} >
                    {selectedProduct.rating.rate}
                    <MdOutlineStar style={{ marginLeft: "4px" }} />
                  </div>
                  <small className="text-muted">
                    ({selectedProduct.rating.count} reviews)
                  </small>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      ) : (
        <div className="text-center my-5">
          <Spinner animation="border" variant="warning" style={{ padding: "30px" }} />
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
