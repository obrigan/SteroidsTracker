import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Camera, Syringe, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertInjectionSchema } from "@shared/schema";

const formSchema = insertInjectionSchema.extend({
  injectionDate: z.date({ required_error: "Дата инъекции обязательна" }),
  injectionTime: z.string().min(1, "Время обязательно"),
  notes: z.string().nullable().optional(),
  painLevel: z.number().nullable().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface CreateInjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const injectionSites = [
  "Дельтовидная мышца (плечо)",
  "Ягодичная мышца",
  "Квадрицепс (бедро)",
  "Вентроглютеальная",
  "Трицепс",
  "Бицепс",
  "Широчайшая мышца",
  "Грудная мышца",
];

const compounds = [
  "Тестостерон энантат",
  "Тестостерон пропионат",
  "Тестостерон ципионат",
  "Нандролон деканоат",
  "Болденон ундесиленат",
  "Тренболон энантат",
  "Тренболон ацетат",
  "Мастерон",
  "Примоболан",
  "Станозолол",
];

export function CreateInjectionModal({ isOpen, onClose }: CreateInjectionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  // Temporary removal of useRef to fix React error
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      compoundName: "",
      dosageAmount: "",
      dosageUnit: "мл",
      injectionSite: "",
      notes: "",
      painLevel: 0,
      injectionDate: new Date(),
      injectionTime: format(new Date(), "HH:mm"),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      
      // Combine date and time
      const injectionDateTime = new Date(data.injectionDate);
      const [hours, minutes] = data.injectionTime.split(':');
      injectionDateTime.setHours(parseInt(hours), parseInt(minutes));
      
      const injectionData = {
        compoundName: data.compoundName,
        dosageAmount: data.dosageAmount,
        dosageUnit: data.dosageUnit,
        injectionSite: data.injectionSite,
        injectionDate: injectionDateTime.toISOString(),
        notes: data.notes || "",
        painLevel: data.painLevel,
      };
      
      formData.append('data', JSON.stringify(injectionData));
      
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }
      
      return await fetch("/api/injections", {
        method: "POST",
        body: formData,
        credentials: 'include',
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || 'Ошибка создания инъекции');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/injections"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/activity"] });
      toast({
        title: "Инъекция добавлена",
        description: "Ваша инъекция успешно записана",
      });
      form.reset();
      setSelectedPhoto(null);
      setPhotoPreview(null);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить инъекцию",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Файл слишком большой",
          description: "Размер фото не должен превышать 5MB",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedPhoto(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-surface border-gray-800 text-white max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-google-sans flex items-center">
            <Syringe className="w-5 h-5 mr-2 text-medical-blue" />
            Новая инъекция
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="compoundName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Препарат</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-deep-black border-gray-700 text-white">
                        <SelectValue placeholder="Выберите препарат" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card-surface border-gray-700">
                      {compounds.map((compound) => (
                        <SelectItem key={compound} value={compound}>
                          {compound}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dosageAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Дозировка</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1.0"
                        className="bg-deep-black border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dosageUnit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Единица</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-deep-black border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card-surface border-gray-700">
                        <SelectItem value="мл">мл</SelectItem>
                        <SelectItem value="мг">мг</SelectItem>
                        <SelectItem value="ед">ед</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="injectionSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Место инъекции</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-deep-black border-gray-700 text-white">
                        <SelectValue placeholder="Выберите место" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-card-surface border-gray-700">
                      {injectionSites.map((site) => (
                        <SelectItem key={site} value={site}>
                          {site}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="injectionDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-300">Дата</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="bg-deep-black border-gray-700 text-white hover:bg-gray-800 justify-start"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? format(field.value, "dd.MM.yyyy") : "Выберите"}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 bg-card-surface border-gray-700" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                          className="text-white"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="injectionTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Время</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="time"
                        className="bg-deep-black border-gray-700 text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="painLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">
                    Уровень боли: {field.value}/10
                  </FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value || 0]}
                      onValueChange={(value) => field.onChange(value[0])}
                      className="py-4"
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Нет боли</span>
                    <span>Сильная боль</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Заметки (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      value={field.value || ""}
                      placeholder="Реакция, побочные эффекты, особенности..."
                      className="bg-deep-black border-gray-700 text-white resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Photo Upload */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">
                Фото места инъекции (опционально)
              </label>
              
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg border border-gray-700"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={removePhoto}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 rounded-full p-1 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="w-full bg-deep-black border-gray-700 text-gray-300 h-20 flex items-center justify-center rounded border-2 border-dashed">
                  <div className="flex flex-col items-center space-y-2">
                    <Camera className="w-6 h-6" />
                    <span className="text-sm">Фото (временно недоступно)</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="flex-1 bg-gradient-to-r from-medical-blue to-health-green hover:from-medical-blue/90 hover:to-health-green/90"
              >
                {mutation.isPending ? "Добавление..." : "Добавить"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}