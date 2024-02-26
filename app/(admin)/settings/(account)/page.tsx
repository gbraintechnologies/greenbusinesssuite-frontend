'use client'
import { useRouter } from "next/navigation";
import React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import TextInput from "../components/TextInput";
import Button from "../components/Button";


const schema = yup.object({
  firstName: yup
    .string(),
  phone: yup
    .string(),
  status: yup
    .string(),
  lastName: yup
    .string(),
  email: yup
    .string(),
});

function Account() {
  type typeOfSchema = yup.InferType<typeof schema>;


  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<typeOfSchema>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      status: "",
      email: ""
    },
  });


  const onSubmit = async (data: typeOfSchema) => {

  };


  return <div>
    <div>
      <h4 className="font-bold text-lg">Settings and Profile Management</h4>
      <p className="text-sm font-light">From description</p>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ flex: 1 }} className="mt-10">
        <div style={{ textAlign: 'center' }} className="mb-7">
          <div style={{ position: 'relative', width: '150px', height: '150px' }}>
            <img
              src="https://via.placeholder.com/150"
              alt="JK"
              style={{
                borderRadius: '50%',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              color: 'white',
              fontSize: '60px',
              fontWeight: 'bold',
            }}>
              AK
            </div>
          </div>

        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', width: '600px' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
              <div className="mb-5">
                <TextInput
                  label="First name"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  {...register("firstName")}
                  error={errors.firstName?.message}
                />
              </div>
              <div className="mb-5">
                <TextInput
                  label="Phone number"
                  type="tel"
                  placeholder=""
                  autoComplete="off"
                  PrependIcon={
                    <span className="absolute pl-5 text-slate-500">233</span>
                  }
                  {...register("phone")}
                  error={errors.phone?.message}
                />
              </div>
              <div className="mb-5">
                <TextInput
                  label="Status"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  {...register("status")}
                  error={errors.status?.message}
                />
              </div>
            </div>
            <div style={{ flex: 1, marginLeft: '20px' }}>
              <div className="mb-5">
                <TextInput
                  label="Last name"
                  type="text"
                  placeholder=""
                  autoComplete="off"
                  {...register("lastName")}
                  error={errors.lastName?.message}
                />
              </div>
              <div>
                <TextInput
                  label="Email address"
                  type="email"
                  placeholder=""
                  autoComplete="off"
                  {...register("email")}
                  error={errors.email?.message}
                />
              </div>
            </div>
          </form>
        </div>
        <div className="float-right">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            Saves Changes
          </Button>
        </div>
      </div>
    </div>
  </div>
}

export default Account;
