import React from 'react'
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    TextField,
    Button,
    Box
} from '@material-ui/core'
import {FormikHelpers, useFormik} from "formik";
import {loginTC} from "./auth-reducer";
import {useSelector} from "react-redux";
import {AppRootStateType, useAppDispatch} from "../../app/store";
import {Redirect} from 'react-router-dom';

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

type FormikValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

export const Login = () => {
    const isLoggedIn = useSelector<AppRootStateType, boolean>((state) => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const formik = useFormik({
        initialValues : {
            email : '',
            password : '',
            rememberMe : false
        },
        validate : (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length < 3) {
                errors.password = 'The password is too short'
            }
            return errors;
        },
        onSubmit : async (values: FormikValuesType, formikHelpers: FormikHelpers<FormikValuesType>) => {
            const action = await dispatch(loginTC(values))

            if (loginTC.rejected.match(action)) {
                if(action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
            formik.resetForm()
        },
    })

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return (
        <Box height={"calc(100vh - 64px)"} display="flex" alignItems="center" justifyContent={"center"}>
                    <form onSubmit={formik.handleSubmit}>
                        <FormControl>
                            <FormLabel>
                                <p>To log in get registered <span> </span>
                                    <a href={'https://social-network.samuraijs.com/'}
                                       target={'_blank'}>here
                                    </a>
                                </p>
                                <p>or use common test account credentials:</p>
                                <p>Email: free@samuraijs.com</p>
                                <p>Password: free</p>
                            </FormLabel>
                            <FormGroup>
                                <TextField
                                    label="Email"
                                    margin="normal"
                                    {...formik.getFieldProps("email")}
                                />
                                {formik.touched.email && formik.errors.email ?
                                    <div style={{color : "red"}}>{formik.errors.email}</div> : null}
                                <TextField
                                    type="password"
                                    label="Password"
                                    margin="normal"
                                    {...formik.getFieldProps("password")}
                                />
                                {formik.touched.password && formik.errors.password ?
                                    <div style={{color : "red"}}>{formik.errors.password}</div> : null}
                                <FormControlLabel
                                    label={'Remember me'}
                                    control={<Checkbox
                                        {...formik.getFieldProps("rememberMe")}
                                    />}
                                />
                                <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                            </FormGroup>
                        </FormControl>
                    </form>
        </Box>
    )

}
