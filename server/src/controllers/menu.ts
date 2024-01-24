import { Request, Response } from "express"

export const getMenu = async (req: Request, res: Response) => {

    res.json({msg: "Menu principal"})
}