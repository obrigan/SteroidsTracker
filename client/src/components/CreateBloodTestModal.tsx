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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, TestTube, Upload, X, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertBloodTestSchema } from "@shared/schema";

const formSchema = insertBloodTestSchema.extend({
  testDate: z.date({ required_error: "Дата анализа обязательна" }),
});

type FormData = z.infer<typeof formSchema>;

interface CreateBloodTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const testTypes = [
  "Общий анализ крови",
  "Биохимический анализ",
  "Гормональная панель",
  "Липидный профиль",
  "Печеночные показатели",
  "Почечные показатели",
  "Полный скрининг",
];

const commonTests = {
  "Тестостерон общий": { min: 12, max: 35, unit: "нмоль/л" },
  "Тестостерон свободный": { min: 243, max: 827, unit: "пмоль/л" },
  "Эстрадиол": { min: 40, max: 161, unit: "пмоль/л" },
  "ЛГ": { min: 1.7, max: 8.6, unit: "мЕд/л" },
  "ФСГ": { min: 1.5, max: 12.4, unit: "мЕд/л" },
  "АЛТ": { min: 0, max: 45, unit: "Ед/л" },
  "АСТ": { min: 0, max: 35, unit: "Ед/л" },
  "Билирубин общий": { min: 5, max: 21, unit: "мкмоль/л" },
  "Холестерин общий": { min: 0, max: 5.2, unit: "ммоль/л" },
  "ЛПНП": { min: 0, max: 3.3, unit: "ммоль/л" },
  "ЛПВП": { min: 1.0, max: 2.2, unit: "ммоль/л" },
  "Креатинин": { min: 62, max: 115, unit: "мкмоль/л" },
  "Мочевина": { min: 2.8, max: 7.2, unit: "ммоль/л" },
};

export function CreateBloodTestModal({ isOpen, onClose }: CreateBloodTestModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      testType: "",
      results: {},
      doctorNotes: "",
      alertFlags: [],
      testDate: new Date(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const formData = new FormData();
      
      const bloodTestData = {
        testType: data.testType,
        testDate: data.testDate.toISOString().split('T')[0],
        results: testResults,
        doctorNotes: data.doctorNotes || "",
        alertFlags: calculateAlertFlags(testResults),
      };
      
      formData.append('data', JSON.stringify(bloodTestData));
      
      if (selectedPhoto) {
        formData.append('photo', selectedPhoto);
      }
      
      return await fetch("/api/blood-tests", {
        method: "POST",
        body: formData,
        credentials: 'include',
      }).then(async (res) => {
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || 'Ошибка создания анализа');
        }
        return res.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blood-tests"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/activity"] });
      toast({
        title: "Анализ добавлен",
        description: "Результаты анализа крови успешно записаны",
      });
      form.reset();
      setTestResults({});
      setSelectedPhoto(null);
      setPhotoPreview(null);
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Ошибка",
        description: error.message || "Не удалось добавить анализ",
        variant: "destructive",
      });
    },
  });

  const calculateAlertFlags = (results: Record<string, string>): string[] => {
    const flags: string[] = [];
    
    Object.entries(results).forEach(([test, value]) => {
      const numValue = parseFloat(value);
      if (isNaN(numValue)) return;
      
      const reference = commonTests[test as keyof typeof commonTests];
      if (!reference) return;
      
      if (numValue < reference.min) {
        flags.push(`${test} ниже нормы`);
      } else if (numValue > reference.max) {
        flags.push(`${test} выше нормы`);
      }
    });
    
    return flags;
  };

  const onSubmit = (data: FormData) => {
    if (Object.keys(testResults).length === 0) {
      toast({
        title: "Добавьте результаты",
        description: "Необходимо добавить хотя бы один показатель",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(data);
  };

  const handlePhotoSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const addTestResult = () => {
    const newResults = { ...testResults };
    const testName = `Показатель ${Object.keys(testResults).length + 1}`;
    newResults[testName] = "";
    setTestResults(newResults);
  };

  const updateTestResult = (oldKey: string, newKey: string, value: string) => {
    const newResults = { ...testResults };
    delete newResults[oldKey];
    if (newKey.trim()) {
      newResults[newKey] = value;
    }
    setTestResults(newResults);
  };

  const removeTestResult = (key: string) => {
    const newResults = { ...testResults };
    delete newResults[key];
    setTestResults(newResults);
  };

  const getResultStatus = (testName: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return null;
    
    const reference = commonTests[testName as keyof typeof commonTests];
    if (!reference) return null;
    
    if (numValue < reference.min) return "low";
    if (numValue > reference.max) return "high";
    return "normal";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-surface border-gray-800 text-white max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-google-sans flex items-center">
            <TestTube className="w-5 h-5 mr-2 text-medical-blue" />
            Новый анализ крови
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="testType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-300">Тип анализа</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-deep-black border-gray-700 text-white">
                          <SelectValue placeholder="Выберите тип" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card-surface border-gray-700">
                        {testTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-300">Дата анализа</FormLabel>
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
            </div>

            {/* Test Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Результаты анализов
                </label>
                <Button
                  type="button"
                  size="sm"
                  onClick={addTestResult}
                  className="bg-medical-blue hover:bg-medical-blue/90"
                >
                  Добавить показатель
                </Button>
              </div>

              {Object.entries(testResults).map(([testName, value], index) => {
                const status = getResultStatus(testName, value);
                const reference = commonTests[testName as keyof typeof commonTests];
                
                return (
                  <div key={index} className="bg-deep-black rounded-lg p-3 border border-gray-700">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <Select
                        value={testName}
                        onValueChange={(newKey) => updateTestResult(testName, newKey, value)}
                      >
                        <SelectTrigger className="bg-card-surface border-gray-600 text-white text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card-surface border-gray-700">
                          {Object.keys(commonTests).map((test) => (
                            <SelectItem key={test} value={test}>
                              {test}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <div className="flex space-x-1">
                        <Input
                          value={value}
                          onChange={(e) => updateTestResult(testName, testName, e.target.value)}
                          placeholder="Значение"
                          className="bg-card-surface border-gray-600 text-white text-xs"
                        />
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => removeTestResult(testName)}
                          className="bg-red-600 hover:bg-red-700 px-2"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {reference && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">
                          Норма: {reference.min}-{reference.max} {reference.unit}
                        </span>
                        {status && (
                          <span className={`flex items-center ${
                            status === 'normal' ? 'text-health-green' :
                            status === 'high' ? 'text-medical-red' : 'text-energy-orange'
                          }`}>
                            {status !== 'normal' && <AlertTriangle className="w-3 h-3 mr-1" />}
                            {status === 'normal' ? 'Норма' :
                             status === 'high' ? 'Выше нормы' : 'Ниже нормы'}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <FormField
              control={form.control}
              name="doctorNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Заключение врача (опционально)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Комментарии врача, рекомендации..."
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
                Фото результатов (опционально)
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-deep-black border-gray-700 text-gray-300 hover:bg-gray-800 h-20"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Upload className="w-6 h-6" />
                    <span className="text-sm">Добавить фото результатов</span>
                  </div>
                </Button>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
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
                {mutation.isPending ? "Добавление..." : "Добавить анализ"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}