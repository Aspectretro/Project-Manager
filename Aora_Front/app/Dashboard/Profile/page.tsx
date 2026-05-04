import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function profile() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            
            {/* Cards for profile */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Profile Content 1</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-bold">Text</div>
                    <p className="text-xs text-muted-foreground">Text</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex felx-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Profile Content 2</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-bold">Text</div>
                    <p className="text-xs text-muted-foreground">Text</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-medium">Project/Task Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm font-bold">Text</div>
                    <p className="text-xs text-muted-foreground">Even more text</p>
                </CardContent>
            </Card>
        </div>
    )
}