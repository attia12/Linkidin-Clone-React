import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const queryClient = useQueryClient();
    const {mutate : loginMutation , isLoading} = useMutation({
       mutationFn:async(data) => {
             await axiosInstance.post("/auth/login",data);
       },
       onSuccess:() => {
           queryClient.invalidateQueries({queryKey:['authUser']});
       },
       onError:(error) => {
           console.log(error)
           toast.error(error.response.data.message || "Something went wrong");
       }
    })
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(username, password);
        loginMutation({username, password});
    }

  return (
    <form onSubmit={handleSubmit} className='space-y-4 w-full max-w-md'>
			<input
				type='text'
				placeholder='Username'
				value={username}
				onChange={(e) => setUsername(e.target.value)}
				className='input input-bordered w-full'
				required
			/>
			<input
				type='password'
				placeholder='Password'
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				className='input input-bordered w-full'
				required
			/>

			<button type='submit' className='btn btn-primary w-full'>
				{isLoading ? <Loader className='size-5 animate-spin' /> : "Login"}
			</button>
		</form>
  )
}

export default LoginForm