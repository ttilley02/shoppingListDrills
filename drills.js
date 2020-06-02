require('dotenv').config();
const knex = require('knex');

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
});



// knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .first()
//   .then(result => {
//     console.log(result);
//   });
 

//   const qry = knexInstance
//   .select('product_id', 'name', 'price', 'category')
//   .from('amazong_products')
//   .where({ name: 'Point of view gun' })
//   .first()
//   .toQuery()
//   // .then(result => {
//   //   console.log(result)
//   // })

// console.log(qry);


function searchByGroceryName(searchTerm) {
knexInstance
    .select('id', 'item_name', 'price', 'date_added','checked','category')
    .from('shopping_list')
    .where('item_name', 'ILIKE', `%${searchTerm}%`)
    .then(result => {
    console.log("Search results: ");
    console.log(result);
    });
}

function paginateGroceries(page) {
const productsPerPage = 6;
const offset = productsPerPage * (page - 1);
knexInstance
    .select('id', 'item_name', 'price', 'date_added','checked','category')
    .from('shopping_list')
    .limit(productsPerPage)
    .offset(offset)
    .then(result => {
    console.log("Paginated: ");
    console.log(result);
    });
}

function itemsAfterDays(daysAgo) {
knexInstance
    .select('id', 'item_name', 'price', 'date_added','checked','category')
    .count('date_added AS added')
    .where('date_added', '>' , knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .from('shopping_list')
    .groupBy('id', 'category')
    .orderBy([
        { column: 'added', order: 'item_name' },
      ])
    .then(result => {
    console.log("Items after days: ");
    console.log(result);
    });
}

function eachCategory() {
knexInstance
    .select('category')
    .sum('price')
    .from('shopping_list')
    .groupBy('category')
    .then(result => {
    console.log("Group Categories: ");
    console.log(result);
    });
    }



searchByGroceryName("Ham");
itemsAfterDays(9);
paginateGroceries(3);
eachCategory();