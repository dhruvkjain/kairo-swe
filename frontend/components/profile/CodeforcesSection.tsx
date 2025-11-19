"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import CodeforcesButton from "@/components/CodeforcesButton" 
import CodeforcesDeleteButton from "@/components/CodeforcesDeleteButton"

interface CodeforcesSectionProps {
  hasCF: boolean
  cfData: any
  applicant: any
  isOwner: boolean
}

export default function CodeforcesSection({ hasCF, cfData, applicant, isOwner }: CodeforcesSectionProps) {
  if (!hasCF && !isOwner) return null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <span className="text-blue-600">📊</span> Codeforces
        </CardTitle>
        {isOwner && (
          <div className="flex gap-2">
            <CodeforcesButton userId={applicant.userId} currentLink={applicant.codeforcesLink || ""} />
            {hasCF && (
               <CodeforcesDeleteButton userId={applicant.userId} onDelete={() => window.location.reload()} />
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {!hasCF ? (
          <p className="text-muted-foreground">Link your Codeforces profile to showcase your competitive programming rating.</p>
        ) : cfData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
             <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground uppercase">Current Rating</div>
              <div className="text-3xl font-bold text-blue-600">
                {cfData.rating || "Unrated"}
              </div>
              <div className="text-sm font-medium capitalize mt-1">{cfData.rank || "-"}</div>
            </div>

            <div className="bg-muted p-4 rounded-lg text-center">
              <div className="text-xs text-muted-foreground uppercase">Max Rating</div>
              <div className="text-3xl font-bold text-orange-600">
                {cfData.maxRating || "Unrated"}
              </div>
              <div className="text-sm font-medium capitalize mt-1">{cfData.maxRank || "-"}</div>
            </div>
            
            <div className="flex items-center justify-center bg-muted p-4 rounded-lg">
                 {cfData.avatar && (
                    <img src={cfData.avatar} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-blue-500" />
                 )}
            </div>
          </div>
        ) : (
          <p className="text-red-500">Error loading Codeforces data.</p>
        )}
      </CardContent>
    </Card>
  )
}