
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
import { t } from '../services/translationService';

export const ProfileSelector: React.FC = () => {
  const { profiles, activeProfile, setActiveProfile, saveProfile, deleteProfile, settings } = useApp();
  const lang = settings.language;
  
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
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 h-8 px-2.5 text-xs max-w-[140px] sm:max-w-none">
            <span className="truncate">{activeProfile?.name || t('profile.fallback', lang)}</span>
            <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
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
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.create.title', lang)}</DialogTitle>
            <DialogDescription>
              {t('profile.create.description', lang)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">{t('profile.name', lang)}</Label>
              <Input
                id="name"
                name="name"
                value={profileForm.name}
                onChange={handleChangeInput}
                placeholder={t('profile.namePlaceholder', lang)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workDuration">{t('profile.workDuration', lang)}</Label>
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
                <Label htmlFor="shortBreakDuration">{t('profile.shortBreak', lang)}</Label>
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
                <Label htmlFor="longBreakDuration">{t('profile.longBreak', lang)}</Label>
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
                <Label htmlFor="longBreakInterval">{t('profile.longBreakAfter', lang)}</Label>
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
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>{t('profile.cancel', lang)}</Button>
            <Button onClick={handleCreateProfile}>{t('profile.create', lang)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.edit.title', lang)}</DialogTitle>
            <DialogDescription>
              {t('profile.edit.description', lang)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t('profile.name', lang)}</Label>
              <Input
                id="edit-name"
                name="name"
                value={profileForm.name}
                onChange={handleChangeInput}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-workDuration">{t('profile.workDuration', lang)}</Label>
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
                <Label htmlFor="edit-shortBreakDuration">{t('profile.shortBreak', lang)}</Label>
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
                <Label htmlFor="edit-longBreakDuration">{t('profile.longBreak', lang)}</Label>
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
                <Label htmlFor="edit-longBreakInterval">{t('profile.longBreakAfter', lang)}</Label>
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
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>{t('profile.cancel', lang)}</Button>
            <Button onClick={handleUpdateProfile}>{t('profile.save', lang)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('profile.delete.title', lang)}</DialogTitle>
            <DialogDescription>
              {t('profile.delete.description', lang)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="font-medium">{profileToDelete?.name}</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>{t('profile.cancel', lang)}</Button>
            <Button variant="destructive" onClick={handleDeleteProfile}>{t('profile.delete', lang)}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSelector;
