export const asyncHandler=(fn)=>{
    return(req,rex,next)=>{
        Promise.resolve(fn(req,rex,next)).catch(error=>next(error))
    }
}