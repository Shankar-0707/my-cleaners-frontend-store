import { useEffect } from 'react';
import { Store, Printer, User, LogOut } from 'lucide-react';
import { useLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const Settings = () => {
  const { setPageTitle } = useLayout();
  const { user, store, logout } = useAuth();

  useEffect(() => {
    setPageTitle('Settings');
  }, [setPageTitle]);

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in">
      {/* Store Info */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Store className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Store Information</h2>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Store details are managed by HQ. Contact support for any changes.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Store Name</Label>
            <p className="font-medium">{store.name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Store Code</Label>
            <p className="font-medium font-mono">{store.code}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Zone</Label>
            <p className="font-medium">{store.zone}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone</Label>
            <p className="font-medium">{store.phone}</p>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-muted-foreground">Address</Label>
            <p className="font-medium">{store.address}</p>
          </div>
        </div>
      </div>

      {/* Printer Settings */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Printer className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">Printer Settings</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Default Tag Printer</Label>
            <p className="font-medium">Thermal Printer 1</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Default Invoice Printer</Label>
            <p className="font-medium">Thermal Printer 1</p>
          </div>
          <div className="sm:col-span-2">
            <Label className="text-muted-foreground">Status</Label>
            <div className="flex items-center gap-2 mt-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <User className="h-5 w-5 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">User Profile</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="userName">Name</Label>
            <Input id="userName" value={user?.name || ''} readOnly />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userPhone">Phone</Label>
            <Input id="userPhone" value={user?.phone || ''} readOnly />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="userEmail">Email</Label>
            <Input id="userEmail" value={user?.email || ''} readOnly />
          </div>
        </div>
      </div>

      {/* Logout */}
      <div className="card-elevated p-6">
        <Button
          variant="outline"
          className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Settings;
