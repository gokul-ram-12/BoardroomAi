

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your workspace and enterprise settings.</p>
      </div>

      <div className="grid gap-6">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Workspace Settings</CardTitle>
            <CardDescription>Update your company details and workspace preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" defaultValue="BoardroomAI Corp" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="workspaceUrl">Workspace URL</Label>
              <Input id="workspaceUrl" defaultValue="boardroomai.com/workspace" disabled />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card className="glass-card border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions for your workspace.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="destructive">Delete Workspace</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
