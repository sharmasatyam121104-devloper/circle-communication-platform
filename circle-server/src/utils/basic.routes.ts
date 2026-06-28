import { Request, Response } from "express";

// HOME ROUTE
export const homeRoute = (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    route: "HOME",
    message: "Welcome to the API Server",
  });
};

// TEST ROUTE
export const testRoute = (req: Request, res: Response) => {
  return res.status(200).json({
    success: true,
    route: "TEST",
    message: "Circle-Server is working fine",
  });
};

// NOT FOUND ROUTE
export const notFoundRoute = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    route: "NOT_FOUND",
    message: "Route does not exist",
  });
};