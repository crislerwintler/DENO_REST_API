  import { Client } from 'https://deno.land/x/postgres/mod.ts';
  import { Product } from '../types.ts'
  import { dbCreds } from '../config.ts'

 // Init Client
 const client = new Client(dbCreds)

 // @desc Get all products
 // @route GET /api/v1/products
 const getProducts = async ({ response }: { response: any}) => {
  try {
    await client.connect()

    const result = await client.query("SELECT * FROM products")

    const products = new Array()

    result.rows.map(p => {
    let obj : any = new Object()

    result.rowDescription.columns.map((el, i) => {
        obj[el.name] = p[i]
    })

    products.push(obj)
    })

    response.body = {
      success: true,
      data: products
    }
  } catch (err) {
    response.status = 500
    response.body = {
        success: false,
        msg: err.toString()
    }
  } finally {
      await client.end() 

  }
 }

  // @desc get single product
  // @route GET /api/v1/products/:id
  const getProduct = async ({ params, response } : { params: { id: string }, response: any}) => {
      await getProduct({ params: { "id": params.id }, response })

      if(response.status === 404) {
          response.body = {
              success: false,
              msg: response.body.msg
        }
        response.status = 404
        return
      } else {
          try{
              await client.connect()

              const result = await client.query("DELETE FROM products WHERE = id=$1", params.id)

              response.body = {
                success: true,
                msg:`Product with id ${params.id} has been deleted`
              }
              response.status = 204
          } catch (err) {
              response.status = 500
                response.body = {
                success: false,
                msg: err.toString()
            }
          } finally {
            await client.end()
          }
      }
  }

  export { getProducts, getProduct, addProduct, updateProduct, deleteProduct }
