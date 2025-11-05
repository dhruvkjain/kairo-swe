"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function uploadProfileImage(userId: string, imageUrl: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    revalidatePath("/profile/[Id]");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Failed to update profile image" };
  }
}

export async function updateUserProfile(userId: string, data: any) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role === "APPLICANT") {
      await prisma.applicant.update({
        where: { userId },
        data: {
          about: data.about,
          linkedInLink: data.linkedInLink,
          githubLink: data.githubLink,
          portfolioLink: data.portfolioLink,
          skills: data.skills,
          experience: data.experience,
          phoneNumber: data.phoneNumber,
        },
      });
    } else {
      await prisma.recruiter.update({
        where: { userId },
        data: {
          about: data.about,
          linkedInLink: data.linkedInLink,
          companyName: data.companyName,
          companyWebsite: data.companyWebsite,
          industry: data.industry,
          phoneNumber: data.phoneNumber,
          experience: data.experience,
        },
      });
    }

    revalidatePath("/profile/[Id]");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}