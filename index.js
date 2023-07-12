import { menuArray } from "/data.js"
const main = document.querySelector("main")
const footer = document.querySelector("footer")

// let order = menuArray.map(x => {x.id: 0})
// console.log(order)

function renderInit() {
    for (let item of menuArray) {
        main.innerHTML += `
            <section class="item">
                <div class="icon-and-description">
                    <p class="icon">${item.emoji}</p>
                    <div class="description">
                        <h2>${item.name}</h2>
                        <p>${item.ingredients.join(', ')}</p>
                        <p><span class="price">$${item.price}</span></p>
                    </div>
                </div>
                <button class="add-to-cart" data-id="${item.id}">+</button>
            </section>
            <hr>
        `
    }
}

function render () {
    let ordered = menuArray.filter(x => x.order > 0)

    if (ordered.length > 0) {
        footer.innerHTML = `
        <h2>Your order</h2>
        <ul>
        </ul>
        <hr>
        <div class="total">
            <h3>Total price:</h3>
            <p><span class="price"></span></p>
        </div>
        <button class="complete-order" id="complete-order">Complete order</button>
        `
        const ul = document.querySelector("footer ul")
        let total = 0
        for (let order of ordered) {
            ul.innerHTML += `
            <li>
                <h3>${order.name}
                    <button class="remove" data-remove=${order.id}>remove</button>
                </h3>
                <p><span class="price">$${order.price * order.order}</span></p>
            </li>
            `
            total += order.price * order.order
        }
        document.querySelector("footer .total p .price").textContent = `$${total}`
    } else {
        footer.innerHTML = ''
    }
}

document.addEventListener("click", function(e) {
    if (e.target.dataset.id) {
        const foodId = e.target.dataset.id
        const item = menuArray.filter(x => (x.id == foodId))[0]
        if ( item.order ) {
            item.order += 1
        } else {
            item.order = 1
        }
        render()

    } else if (e.target.dataset.remove) {
        const item = menuArray.filter(x => x.id == e.target.dataset.remove)[0]
        if (item.order >= 1) {
            item.order -= 1
        }
        render()
        
    } else if (e.target.id == 'complete-order') {
        document.querySelector(".modal").classList.toggle("visible")

    } else if (e.target.id == 'pay') {
        e.preventDefault()

        const form = document.querySelector("form")
        const fields = new FormData(form)
        
        let name = fields.get("name")
        let card = fields.get("card")
        let cvv = fields.get("cvv")
        if (name && card && cvv) {
            for (let item of menuArray) {
                item.order = null
            }

            footer.innerHTML = `
            <h2 class="receipt">Thanks, James! Your order is on its way!</h2>
            `
            document.querySelector(".modal").classList.toggle("visible")
        }
    }
})

renderInit()