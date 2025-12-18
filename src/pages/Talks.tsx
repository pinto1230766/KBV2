import React, { useState, useMemo } from 'react';
import { initialPublicTalks } from '@/data/constants';
import { PublicTalk } from '@/types';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';

export const Talks: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'number' | 'theme'>('number');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unavailable'>(
    'all'
  );

  // Get the discourses from the data context or use the static list
  const discourses = initialPublicTalks;

  // Filter and sort discourses
  const filteredAndSortedDiscourses = useMemo(() => {
    const filtered = discourses.filter((discours: PublicTalk) => {
      const matchesSearch =
        discours.theme.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discours.number.toString().includes(searchTerm);

      const isUnavailable =
        discours.theme.includes('(Pa ka uza)') ||
        discours.theme.includes('(Ka sta disponível na Kabuverdianu)');

      const matchesAvailability =
        filterAvailability === 'all' ||
        (filterAvailability === 'available' && !isUnavailable) ||
        (filterAvailability === 'unavailable' && isUnavailable);

      return matchesSearch && matchesAvailability;
    });

    // Sort discourses
    filtered.sort((a, b) => {
      if (sortBy === 'number') {
        return Number(a.number) - Number(b.number);
      } else {
        return a.theme.localeCompare(b.theme);
      }
    });

    return filtered;
  }, [discourses, searchTerm, sortBy, filterAvailability]);

  const getAvailabilityBadge = (theme: string) => {
    if (theme.includes('(Pa ka uza)')) {
      return (
        <Badge variant='warning' className='text-xs'>
          Pa ka uza
        </Badge>
      );
    }
    if (theme.includes('(Ka sta disponível na Kabuverdianu)')) {
      return (
        <Badge variant='info' className='text-xs'>
          Ka sta disponível
        </Badge>
      );
    }
    return (
      <Badge variant='success' className='text-xs'>
        Dísponível
      </Badge>
    );
  };

  return (
    <div className='p-4'>
      <div className='flex flex-col gap-4 mb-6'>
        <h2 className='text-3xl font-bold text-gray-800'>Discours Públicos</h2>
        <p className='text-gray-600'>Lista kompleta di 134 discours públiku na Kabuverdianu</p>

        {/* Stats */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-blue-600'>{discourses.length}</div>
              <div className='text-sm text-gray-600'>Total Discours</div>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-green-600'>
                {
                  discourses.filter(
                    (d) => !d.theme.includes('Pa ka uza') && !d.theme.includes('Ka sta disponível')
                  ).length
                }
              </div>
              <div className='text-sm text-gray-600'>Dísponível</div>
            </div>
          </Card>
          <Card className='p-4'>
            <div className='text-center'>
              <div className='text-2xl font-bold text-orange-600'>
                {filteredAndSortedDiscourses.length}
              </div>
              <div className='text-sm text-gray-600'>Filtrado</div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='flex-1'>
            <Input
              type='text'
              placeholder='Bush diskursu (número ó tema)...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex gap-2'>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'number' | 'theme')}
              className='min-w-32'
              options={[
                { value: 'number', label: 'Número' },
                { value: 'theme', label: 'Tema' },
              ]}
            />
            <Select
              value={filterAvailability}
              onChange={(e) =>
                setFilterAvailability(e.target.value as 'all' | 'available' | 'unavailable')
              }
              className='min-w-40'
              options={[
                { value: 'all', label: 'Tudu' },
                { value: 'available', label: 'Dísponível' },
                { value: 'unavailable', label: 'Ka dísponível' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Discourse List */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {filteredAndSortedDiscourses.map((discours: PublicTalk) => (
          <Card key={discours.number} className='p-4 hover:shadow-md transition-shadow'>
            <div className='flex flex-col h-full'>
              <div className='flex items-start justify-between mb-2'>
                <div className='text-sm font-medium text-gray-500'>Discours #{discours.number}</div>
                {getAvailabilityBadge(discours.theme)}
              </div>

              <h3 className='font-semibold text-gray-800 mb-2'>{discours.theme}</h3>

              <div className='mt-auto pt-2'>
                <div className='text-xs text-gray-500'>
                  Idioma: {discours.language === 'cv' ? 'Kabuverdianu' : discours.language}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredAndSortedDiscourses.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg mb-2'>Nenhum discurso encontrado</div>
          <div className='text-gray-400 text-sm'>Tenta modificar os filtros de busca</div>
        </div>
      )}
    </div>
  );
};
