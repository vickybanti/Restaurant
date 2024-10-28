"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


type Inputs = {
    title:string;
    price:number;
    desc:string;
    catSlug:string;
}


type Option = {
    title:string;
    additionalPrice:number 
}
const page = () => {
    const router = useRouter()
    const {data:session, status} =  useSession()
    const [file, setFile] = useState<File>()
    const [isLoading, setLoading] = useState(false)
    const [inputs, setInputs] = useState<Inputs>({
        title:"",
        price:0,
        desc:"",
        catSlug:""
    })

    const [option, setOption] = useState<Option>({
        title: "",
        additionalPrice:0

    })
    const [options, setOptions] = useState<Option[]>([])

    const handleChange =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs(prev => {
             return {...prev,[e.target.name]:e.target.value
        }
        })
    }

        const changeOptions =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            
            setOption(prev => { return {...prev,[e.target.name]:e.target.value
            }
            })

    }

    const handleChangeImage = (e:React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement
        const item = (target.files as FileList)[0]
        setFile(item)
    }

    const upload = async () => {
        const data = new FormData()
        data.append("file", file!)
        data.append("upload_preset","restaurant")
        const res = await fetch(`https://api.cloudinary.com/v1_1/du3vn9rkg/image/upload`, {
            method: "POST",
            body: data,
          });

        const resData = await res.json();
        console.log(resData)
        return resData.url;
    }

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const url = await upload()
        setLoading(true)
        try {
         const res= await fetch("http://localhost:3000/api/products",{
            method: "POST",
            body:JSON.stringify({
                img:url,
                ...inputs,
                options
            })
            

         })   
         const data = await res.json()
         console.log(data)
        router.push(`/product/${data.id}`)
        setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className="p-32 m-20 ">
          <form className='shadow-lg flex flex-wrap gap-4 p-8' onSubmit={handleSubmit} >
              <h1>Add new product</h1>
              <div className='w-full flex flex-col gap-2'>
                  <label>Title</label>
                  <input onChange={handleChange} type="text" name="title" className='ring-1 ring-red-200 p-2 rounded-sm'/>
              </div>

              <div className='w-full flex flex-col gap-2'>
                  <label>Image</label>
                  <input onChange={handleChangeImage} type="file"  className='ring-1 ring-red-200 p-2 rounded-sm'/>
              </div>

              <div className='w-full flex flex-col gap-2'>
                  <label>Desc</label>
                  <textarea onChange={handleChange} name="desc" className='ring-1 ring-red-200 p-2 rounded-sm'/>
              </div>
              <div className='w-full flex flex-col gap-2'>
                  <label>Price</label>
                  <input onChange={handleChange} type="number" name="price" className='ring-1 ring-red-200 p-2 rounded-sm'/>

              </div>

              <div className='w-full flex flex-col gap-2'>
                  <label>Category</label>
                  <input onChange={handleChange} type="text" name="catSlug" className='ring-1 ring-red-200 p-2 rounded-sm'/>
              </div>
              <div className='w-full flex flex-col gap-2'> 
                  <label>Options</label>
                  <div>
                      <input onChange={changeOptions} className='ring ring-red-200 p-2 rounded-sm' type="text" name="title" placeholder='Title' />
                      <input onChange={changeOptions} className='ring ring-red-200 p-2 rounded-sm' type="number" name="additionalPrice" placeholder='Additional Price' />
                  </div>
                  <button 
                    type="button"
                    className='w-52 bg-red-500 text-white p-2'
                    onClick={() => setOptions((prev) => [...prev,option])}
                  >
                    Add Options
                  </button>
          </div>
          <div className='w-full flex flex-col gap-2'>
              {options.map((item) => (
                <div className='ring-1 p-2 ring-red-500 rounded-md cursor-pointer' key={item.title} onClick={() => setOptions(options.filter(opt=>opt.title !== item.title))}>
                <span>{item.title}</span>
                <span>${item.additionalPrice}</span>
            </div>
              ))
                }
          </div>
          <button className='p-2 w-full bg-[#404212] text-white flex items-center justify-center gap-2' type='submit'>Add Product  {isLoading && (<Image src="/temporary/p2.png" alt="loading" width={50} height={50} className='animate-spin bg-blend-multiply'/>)}</button>
        </form>
    </div>
  )
}

export default page
