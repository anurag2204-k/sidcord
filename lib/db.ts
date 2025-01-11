import {PrismaClient} from "@prisma/client";

declare global{
      // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
}

//so that we do not initilize to many prisma client.
//when in development, when we write any code, the server gets hot reload, and new prisma client is genereated every time.
//thus we uppended prisma client to globalThis.primsa, because globalThis is not effected by hot reload.
//else we should have just did 
//      db=new PrismaClient();  
