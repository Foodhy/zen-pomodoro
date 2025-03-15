
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Profile } from '../models/types';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, Plus, Edit, Trash2 } from 'lucide-react';

export const ProfileSelector: React.FC = () => {
  const { profiles, activeProfile, setActiveProfile, saveProfile, deleteProfile } = useApp();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({
    name: '',
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4
  });
  
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null);
  const [profileToDelete, setProfileToDelete] = useState<Profile | null>(null);
  
  const handleCreateProfile = () => {
    if (profileForm.name) {
      const newProfile: Profile = {
        id: `profile-${Date.now()}`,
        name: profileForm.name,
        workDuration: profileForm.workDuration || 25,
        shortBreakDuration: profileForm.shortBreakDuration || 5,
        longBreakDuration: profileForm.longBreakDuration || 15,
        longBreakInterval: profileForm.longBreakInterval || 4,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      saveProfile(newProfile);
      setActiveProfile(newProfile);
      resetForm();
      setIsCreateOpen(false);
    }
  };
  
  const handleUpdateProfile = () => {
    if (profileToEdit && profileForm.name) {
      const updatedProfile: Profile = {
        ...profileToEdit,
        name: profileForm.name,
        workDuration: profileForm.workDuration || 25,
        shortBreakDuration: profileForm.shortBreakDuration || 5,
        longBreakDuration: profileForm.longBreakDuration || 15,
        longBreakInterval: profileForm.longBreakInterval || 4,
        updatedAt: new Date().toISOString()
      };
      
      saveProfile(updatedProfile);
      if (activeProfile && activeProfile.id === updatedProfile.id) {
        setActiveProfile(updatedProfile);
      }
      
      resetForm();
      setIsEditOpen(false);
    }
  };
  
  const handleDeleteProfile = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete.id);
      setIsDeleteOpen(false);
    }
  };
  
  const openEditDialog = (profile: Profile) => {
    setProfileToEdit(profile);
    setProfileForm({
      name: profile.name,
      workDuration: profile.workDuration,
      shortBreakDuration: profile.shortBreakDuration,
      longBreakDuration: profile.longBreakDuration,
      longBreakInterval: profile.longBreakInterval
    });
    setIsEditOpen(true);
  };
  
  const openDeleteDialog = (profile: Profile) => {
    setProfileToDelete(profile);
    setIsDeleteOpen(true);
  };
  
  const resetForm = () => {
    setProfileForm({
      name: '',
      workDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      longBreakInterval: 4
    });
    setProfileToEdit(null);
    setProfileToDelete(null);
  };
  
  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'name') {
      setProfileForm(prev => ({ ...prev, [name]: value }));
    } else {
      const numVal = parseInt(value);
      if (!isNaN(numVal) && numVal > 0) {
        setProfileForm(prev => ({ ...prev, [name]: numVal }));
      }
    }
  };
  
  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {activeProfile?.name || 'Select Profile'}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {profiles.map(profile => (
            <DropdownMenuItem
              key={profile.id}
              className="flex items-center justify-between"
              onClick={() => setActiveProfile(profile)}
            >
              <span className="flex-1">{profile.name}</span>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(profile);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                
                {profiles.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteDialog(profile);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogTrigger asChild>
          <Button size="icon" variant="ghost" className="h-9 w-9">
            <Plus className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Profile</DialogTitle>
            <DialogDescription>
              Create a new profile with custom Pomodoro settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Profile Name</Label>
              <Input
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleChangeInput}
                placeholder="e.g., Coding, Reading"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration">Work Duration (min)</Label>
                <Input
                  id="workDuration"
                  name="workDuration"
                  type="number"
                  min="1"
                  value={profileForm.workDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shortBreakDuration">Short Break (min)</Label>
                <Input
                  id="shortBreakDuration"
                  name="shortBreakDuration"
                  type="number"
                  min="1"
                  value={profileForm.shortBreakDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longBreakDuration">Long Break (min)</Label>
                <Input
                  id="longBreakDuration"
                  name="longBreakDuration"
                  type="number"
                  min="1"
                  value={profileForm.longBreakDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="longBreakInterval">Long Break After</Label>
                <Input
                  id="longBreakInterval"
                  name="longBreakInterval"
                  type="number"
                  min="1"
                  value={profileForm.longBreakInterval}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateProfile}>Create Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Profile Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={profileForm.name}
                onChange={handleChangeInput}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workDuration">Work Duration (min)</Label>
                <Input
                  id="edit-workDuration"
                  name="workDuration"
                  type="number"
                  min="1"
                  value={profileForm.workDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-shortBreakDuration">Short Break (min)</Label>
                <Input
                  id="edit-shortBreakDuration"
                  name="shortBreakDuration"
                  type="number"
                  min="1"
                  value={profileForm.shortBreakDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-longBreakDuration">Long Break (min)</Label>
                <Input
                  id="edit-longBreakDuration"
                  name="longBreakDuration"
                  type="number"
                  min="1"
                  value={profileForm.longBreakDuration}
                  onChange={handleChangeInput}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-longBreakInterval">Long Break After</Label>
                <Input
                  id="edit-longBreakInterval"
                  name="longBreakInterval"
                  type="number"
                  min="1"
                  value={profileForm.longBreakInterval}
                  onChange={handleChangeInput}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Profile</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this profile? This will also delete all associated tasks and history.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{profileToDelete?.name}</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSelector;
