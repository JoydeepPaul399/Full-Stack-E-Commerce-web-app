const calculateDiscount= (price, discount)=>{
    const discountAmount=Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice= Number(price)- Number(discountAmount)

    return actualPrice
}

export default calculateDiscount