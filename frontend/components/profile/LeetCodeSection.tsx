"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import LeetCodeButton from "@/components/LeetCodeButton" 
import LeetCodeDeleteButton from "@/components/LeetCodeDeleteButton"

interface LeetCodeSectionProps {
  hasLeetCode: boolean
  leetCodeData: any
  applicant: any
  isOwner: boolean
}

export default function LeetCodeSection({ 
  hasLeetCode, 
  leetCodeData, 
  applicant, 
  isOwner 
}: LeetCodeSectionProps) {
  
  if (!hasLeetCode && !isOwner) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="text-yellow-600">⚡</span> LeetCode
        </CardTitle>
      
        {isOwner && (
          <div className="flex gap-2">
            <LeetCodeButton 
              userId={applicant.userId} 
              currentLink={applicant.leetcodeLink || ""} 
            />
            {hasLeetCode && (
               <LeetCodeDeleteButton 
                 userId={applicant.userId} 
                 onDelete={() => window.location.reload()} 
               />
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!hasLeetCode ? (
          <p className="text-muted-foreground">Link your LeetCode profile to showcase your problem-solving stats.</p>
        ) : leetCodeData ? (
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
            <div className="bg-muted p-3 rounded-lg text-center">
              <div className="text-xs text-muted-foreground uppercase">Total Solved</div>
              <div className="text-2xl font-bold">{leetCodeData.totalSolved}</div>
            </div>
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg text-center">
              <div className="text-xs text-green-600 uppercase">Easy</div>
              <div className="text-xl font-bold text-green-600">{leetCodeData.easySolved}</div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-3 rounded-lg text-center">
              <div className="text-xs text-yellow-600 uppercase">Medium</div>
              <div className="text-xl font-bold text-yellow-600">{leetCodeData.mediumSolved}</div>
            </div>
            <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg text-center">
              <div className="text-xs text-red-600 uppercase">Hard</div>
              <div className="text-xl font-bold text-red-600">{leetCodeData.hardSolved}</div>
            </div>
          </div>
        ) : (
          <p className="text-red-500">Error loading LeetCode data.</p>
        )}
      </CardContent>
    </Card>
  )
}