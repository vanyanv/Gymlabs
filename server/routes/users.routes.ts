import { Router } from 'express';
import { Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();


router.get("/", async(req: Request, res: Response) => {

})

router.get("/:id", async(req: Request, res: Response) => {
    
})

router.post("/", async(req: Request, res: Response) => {
    
})

router.delete("/:id", async(req: Request, res: Response) => {
    
})

export default router