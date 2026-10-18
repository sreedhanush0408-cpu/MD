const state = {

  product: "tshirt",

  productName: "Classic T-Shirt",

  color: "#151515",

  colorName: "Black",

  size: "M — Medium",

  side: "front",

  rotation: 0,

  quantity: 1,

  photo: false,

  text: "YOUR\nSTORY",

  textSize: 42,

  x: 50,

  y: 48,

  photoSize: 35,

  deliveryKm: 3

};


const products = {

  tshirt: {
    name:"Classic T-Shirt",
    base:249,
    cls:"garment-tshirt"
  },

  oversized: {
    name:"Oversized T-Shirt",
    base:299,
    cls:"garment-oversized"
  },

  hoodie: {
    name:"Premium Hoodie",
    base:599,
    cls:"garment-hoodie"
  },

  sleeveless: {
    name:"Sleeveless T-Shirt",
    base:279,
    cls:"garment-sleeveless"
  },

  jeans: {
    name:"Classic Jeans",
    base:649,
    cls:"garment-jeans"
  },

  formal: {
    name:"Formal Pants",
    base:699,
    cls:"garment-formal"
  },

  linen: {
    name:"Linen Pants",
    base:599,
    cls:"garment-linen"
  },

  track: {
    name:"Track Pants",
    base:449,
    cls:"garment-track"
  }

};


const $ = selector =>
  document.querySelector(selector);


const $$ = selector =>
  [...document.querySelectorAll(selector)];


const garment =
  $("#garment");

const productStage =
  $("#productStage");

const designText =
  $("#designText");

const designPhoto =
  $("#designPhoto");

const printSurface =
  $("#printSurface");


function money(number){

  return "₹" +
    Math.round(number)
      .toLocaleString("en-IN");

}


/* ================= PRODUCT ================= */

function setProduct(key){

  state.product = key;

  state.productName =
    products[key].name;

  garment.className =
    "garment " +
    products[key].cls;

  $("#summaryProduct").textContent =
    state.productName;

  $$(".pill[data-product]")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.product === key
      );

    });

  calculate();

}


/* ================= ROTATION ================= */

function setRotation(deg){

  state.rotation =
    Number(deg);

  $("#rotate360").value =
    state.rotation;

  $("#rotateValue").textContent =
    state.rotation + "°";

  productStage.style.transform =
    `rotateY(${state.rotation}deg)`;


  const normalized =
    (
      state.rotation % 360 + 360
    ) % 360;


  let label =

    normalized < 45 ||
    normalized >= 315

      ? "FRONT VIEW"

      : normalized < 135

      ? "RIGHT SIDE"

      : normalized < 225

      ? "BACK VIEW"

      : "LEFT SIDE";


  $("#viewLabel").textContent =
    label;


  $$(".angle-dots button")
    .forEach(button => {

      button.classList.toggle(

        "active",

        Math.abs(
          Number(button.dataset.rotation)
          - normalized
        ) < 23

      );

    });

}


/* ================= DESIGN ================= */

function applyDesign(){

  designText.textContent =
    state.text;


  designText.style.fontFamily =
    `"${$("#fontStyle").value}", sans-serif`;


  designText.style.color =
    $("#textColor").value;


  designText.style.fontSize =
    state.textSize + "px";


  designText.style.fontWeight =

    $("#boldBtn").classList.contains("active")

      ? "800"

      : "500";


  designText.style.fontStyle =

    $("#italicBtn").classList.contains("active")

      ? "italic"

      : "normal";


  designText.style.left =
    state.x + "%";


  designText.style.top =
    state.y + "%";


  designPhoto.style.left =
    state.x + "%";


  designPhoto.style.top =
    state.y + "%";


  designPhoto.style.width =
    state.photoSize + "%";

}


/* ================= PRICE ================= */

function calculate(){

  const product =
    products[state.product];


  let custom = 0;


  const length =
    state.text
      .trim()
      .replace(/\s+/g," ")
      .length;


  if(
    length > 0 &&
    length <= 5
  ){

    custom += 50;

  }

  else if(
    length > 5 &&
    length <= 15
  ){

    custom += 70;

  }

  else if(
    length > 15
  ){

    custom += 100;

  }


  if(state.photo){

    custom += 50;

  }


  if(state.side === "back"){

    custom += 50;

  }


  const productTotal =

    (product.base + custom) *
    state.quantity;


  const delivery =

    state.deliveryKm * 9;


  const grandTotal =

    productTotal + delivery;


  $("#price").textContent =
    money(productTotal);


  $("#summaryTotal").textContent =
    money(productTotal);


  $("#summaryColor").textContent =
    state.colorName;


  $("#summarySize").textContent =
    state.size;


  $("#summarySide").textContent =

    state.side === "front"

      ? "Front"

      : "Back";


  $("#priceNote").textContent =

    `Base ${money(product.base)}
     + customisation ${money(custom)}
     • Delivery extra`;


  $("#deliveryCharge").textContent =
    money(delivery);


  $("#grandTotal").textContent =
    money(grandTotal);


  $("#quantity").textContent =
    state.quantity;

}


/* ================= PRODUCT BUTTONS ================= */

$$("[data-product]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        setProduct(
          button.dataset.product
        );

      }
    );

  });


/* ================= COLOURS ================= */

$$(".swatch")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        $$(".swatch")
          .forEach(item =>
            item.classList.remove("active")
          );


        button.classList.add("active");


        state.color =
          button.dataset.color;


        state.colorName =
          button.dataset.name;


        garment.style.setProperty(
          "--garment-color",
          state.color
        );


        $("#colourName").textContent =
          state.colorName;


        calculate();

      }
    );

  });


/* ================= SIZE ================= */

$("#size")
  .addEventListener(
    "change",
    event => {

      state.size =
        event.target.value;

      $("#summarySize").textContent =
        state.size;

    }
  );


/* ================= TEXT ================= */

$("#customText")
  .addEventListener(
    "input",
    event => {

      state.text =
        event.target.value;

      applyDesign();

      calculate();

    }
  );


$("#fontStyle")
  .addEventListener(
    "change",
    applyDesign
  );


$("#textColor")
  .addEventListener(
    "input",
    applyDesign
  );


$("#textSize")
  .addEventListener(
    "input",
    event => {

      state.textSize =
        Number(event.target.value);


      $("#textSizeValue").textContent =
        event.target.value;


      applyDesign();

    }
  );


/* ================= POSITION ================= */

$("#posX")
  .addEventListener(
    "input",
    event => {

      state.x =
        Number(event.target.value);


      $("#posXValue").textContent =
        event.target.value + "%";


      applyDesign();

    }
  );


$("#posY")
  .addEventListener(
    "input",
    event => {

      state.y =
        Number(event.target.value);


      $("#posYValue").textContent =
        event.target.value + "%";


      applyDesign();

    }
  );


$("#photoSize")
  .addEventListener(
    "input",
    event => {

      state.photoSize =
        Number(event.target.value);


      $("#photoSizeValue").textContent =
        event.target.value + "%";


      applyDesign();

    }
  );


/* ================= 360 ================= */

$("#rotate360")
  .addEventListener(
    "input",
    event => {

      setRotation(
        event.target.value
      );

    }
  );


$$("[data-rotation]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        setRotation(
          button.dataset.rotation
        );

      }
    );

  });


/* ================= FRONT / BACK ================= */

$$("[data-side]")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        $$("[data-side]")
          .forEach(item =>
            item.classList.remove("active")
          );


        button.classList.add("active");


        state.side =
          button.dataset.side;


        $("#summarySide").textContent =

          state.side === "front"

            ? "Front"

            : "Back";


        if(
          state.side === "back" &&
          state.rotation < 120
        ){

          setRotation(180);

        }


        calculate();

      }
    );

  });


/* ================= BOLD ================= */

$("#boldBtn")
  .addEventListener(
    "click",
    event => {

      event.currentTarget
        .classList.toggle("active");

      applyDesign();

    }
  );


/* ================= ITALIC ================= */

$("#italicBtn")
  .addEventListener(
    "click",
    event => {

      event.currentTarget
        .classList.toggle("active");

      applyDesign();

    }
  );


/* ================= CENTER ================= */

$("#centerTextBtn")
  .addEventListener(
    "click",
    () => {

      state.x = 50;
      state.y = 48;


      $("#posX").value = 50;
      $("#posY").value = 48;


      $("#posXValue").textContent =
        "50%";

      $("#posYValue").textContent =
        "48%";


      applyDesign();

    }
  );


/* ================= PHOTO UPLOAD ================= */

$("#photoUpload")
  .addEventListener(
    "change",
    event => {

      const file =
        event.target.files[0];


      if(!file){

        return;

      }


      if(
        !file.type.startsWith("image/")
      ){

        alert(
          "Please choose an image file."
        );

        return;

      }


      const reader =
        new FileReader();


      reader.onload =
        result => {

          designPhoto.src =
            result.target.result;


          designPhoto.style.display =
            "block";


          state.photo = true;


          calculate();

        };


      reader.readAsDataURL(file);

    }
  );


/* ================= REMOVE PHOTO ================= */

$("#removePhoto")
  .addEventListener(
    "click",
    () => {

      designPhoto.src = "";

      designPhoto.style.display =
        "none";

      $("#photoUpload").value = "";

      state.photo = false;

      calculate();

    }
  );


/* ================= QUANTITY ================= */

$("#qtyMinus")
  .addEventListener(
    "click",
    () => {

      state.quantity =
        Math.max(
          1,
          state.quantity - 1
        );

      calculate();

    }
  );


$("#qtyPlus")
  .addEventListener(
    "click",
    () => {

      state.quantity =
        Math.min(
          99,
          state.quantity + 1
        );

      calculate();

    }
  );


/* ================= DELIVERY ================= */

$("#distance")
  .addEventListener(
    "input",
    event => {

      state.deliveryKm =
        Math.max(
          0,
          Number(event.target.value) || 0
        );

      calculate();

    }
  );


/* ================= GPS ================= */

$("#locationBtn")
  .addEventListener(
    "click",
    () => {

      const status =
        $("#locationStatus");


      if(!navigator.geolocation){

        status.textContent =
          "GPS is not supported. Enter distance manually.";

        return;

      }


      status.textContent =
        "Getting your location…";


      navigator.geolocation
        .getCurrentPosition(

          position => {

            status.textContent =

              `Location captured ✓
              (${position.coords.latitude.toFixed(5)},
              ${position.coords.longitude.toFixed(5)}).

              Enter the shop-to-home distance
              above for the ₹9/km charge.`;

          },

          () => {

            status.textContent =
              "Could not access GPS. Please enter the distance manually.";

          }

        );

    }
  );


/* ================= COLLECTION CARDS ================= */

$$(".collection-card")
  .forEach(card => {

    card.addEventListener(
      "click",
      () => {

        setProduct(
          card.dataset.product
        );


        document
          .querySelector("#studio")
          .scrollIntoView({
            behavior:"smooth"
          });

      }
    );

  });


/* ================= DRAG DESIGN ================= */

[
  designText,
  designPhoto
]
.forEach(element => {

  let dragging = false;

  let startX = 0;

  let startY = 0;

  let startPX = 0;

  let startPY = 0;


  const down = event => {

    if(
      element === designPhoto &&
      !state.photo
    ){

      return;

    }


    dragging = true;


    element.setPointerCapture?.(
      event.pointerId
    );


    const rect =
      printSurface.getBoundingClientRect();


    startX =
      event.clientX;

    startY =
      event.clientY;


    startPX =
      state.x;

    startPY =
      state.y;


    element.style.cursor =
      "grabbing";

  };


  const move = event => {

    if(!dragging){

      return;

    }


    const rect =
      printSurface.getBoundingClientRect();


    state.x =
      Math.max(
        5,
        Math.min(
          95,
          startPX +
          (
            event.clientX -
            startX
          ) /
          rect.width *
          100
        )
      );


    state.y =
      Math.max(
        5,
        Math.min(
          95,
          startPY +
          (
            event.clientY -
            startY
          ) /
          rect.height *
          100
        )
      );


    $("#posX").value =
      Math.round(state.x);


    $("#posY").value =
      Math.round(state.y);


    $("#posXValue").textContent =
      Math.round(state.x) + "%";


    $("#posYValue").textContent =
      Math.round(state.y) + "%";


    applyDesign();

  };


  const up = () => {

    dragging = false;

    element.style.cursor =
      "grab";

  };


  element.addEventListener(
    "pointerdown",
    down
  );


  element.addEventListener(
    "pointermove",
    move
  );


  element.addEventListener(
    "pointerup",
    up
  );


  element.addEventListener(
    "pointercancel",
    up
  );

});


/* ================= MOUSE WHEEL ROTATION ================= */

$("#viewer")
  .addEventListener(
    "wheel",
    event => {

      event.preventDefault();


      setRotation(

        (
          state.rotation +
          (
            event.deltaY > 0
              ? 12
              : -12
          ) +
          360
        ) % 360

      );

    },
    {
      passive:false
    }
  );


/* ================= ORDER ID ================= */

function generateOrderID(){

  const date =
    new Date();


  const datePart =

    date.getFullYear()
      .toString() +

    String(
      date.getMonth() + 1
    ).padStart(2,"0") +

    String(
      date.getDate()
    ).padStart(2,"0");


  const random =

    Math.floor(
      1000 +
      Math.random() * 9000
    );


  return `CT-${datePart}-${random}`;

}


let latestOrder = null;


/* ================= ORDER ================= */

$("#orderForm")
  .addEventListener(
    "submit",
    event => {

      event.preventDefault();


      const payment =

        document
          .querySelector(
            'input[name="payment"]:checked'
          )
          .value;


      const orderID =
        generateOrderID();


      const order = {

        orderID,

        customer:{

          name:
            $("#customerName")
              .value
              .trim(),

          phone:
            $("#phone")
              .value
              .trim(),

          email:
            $("#email")
              .value
              .trim(),

          address:
            $("#address")
              .value
              .trim(),

          city:
            $("#city")
              .value
              .trim(),

          pincode:
            $("#pincode")
              .value
              .trim()

        },


        product:{

          type:
            state.productName,

          colour:
            state.colorName,

          size:
            state.size,

          side:
            state.side,

          text:
            state.text,

          font:
            $("#fontStyle")
              .value,

          photo:
            state.photo,

          quantity:
            state.quantity,

          rotation:
            state.rotation

        },


        delivery:{

          km:
            state.deliveryKm,

          rate:9,

          charge:
            state.deliveryKm * 9

        },


        payment,

        total:
          $("#grandTotal")
            .textContent,

        createdAt:
          new Date()
            .toISOString()

      };


      latestOrder =
        order;


      localStorage.setItem(

        "CT_" + orderID,

        JSON.stringify(order)

      );


      $("#orderId")
        .textContent =
        orderID;


      $("#successSection")
        .style.display =
        "block";


      $("#successSection")
        .scrollIntoView({
          behavior:"smooth"
        });

    }
  );


/* ================= WHATSAPP ================= */

$("#whatsappOrder")
  .addEventListener(
    "click",
    () => {

      if(!latestOrder){

        return;

      }


      const order =
        latestOrder;


      const message =

        `CUSTOM THREADS ORDER%0A
        Order ID: ${order.orderID}%0A
        Name: ${order.customer.name}%0A
        Phone: ${order.customer.phone}%0A
        Product: ${order.product.type}%0A
        Colour: ${order.product.colour}%0A
        Size: ${order.product.size}%0A
        Print: ${order.product.side}%0A
        Text: ${order.product.text || "None"}%0A
        Quantity: ${order.product.quantity}%0A
        Delivery: ${order.delivery.km} km = ₹${order.delivery.charge}%0A
        Total: ${order.total}`;


      window.open(

        "https://wa.me/919999999999?text=" +
        message,

        "_blank"

      );

    }
  );


/* ================= PAYMENT ================= */

document
  .querySelectorAll(
    'input[name="payment"]'
  )
  .forEach(radio => {

    radio.addEventListener(
      "change",
      () => {

        $("#qrBox").style.display =

          radio.checked &&
          radio.value === "UPI"

            ? "flex"

            : "none";

      }
    );

  });


/* ================= INITIALIZE ================= */

garment.style.setProperty(
  "--garment-color",
  state.color
);


applyDesign();

calculate();

setRotation(0);