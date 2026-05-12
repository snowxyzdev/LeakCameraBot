export default async function handler(req,res){

    try{

        const { token } = req.body;

        const secret = process.env.TURNSTILE_SECRET_KEY;

        const formData = new URLSearchParams();

        formData.append("secret", secret);
        formData.append("response", token);

        const response = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method:"POST",
                body:formData
            }
        );

        const data = await response.json();

        return res.status(200).json(data);

    }catch(err){

        return res.status(500).json({
            success:false,
            error:err.message
        });

    }

}
