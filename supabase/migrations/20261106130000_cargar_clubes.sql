-- Carga del catálogo de clubes: los 95 que jugaron Serie A o Serie B nacional hasta 2026.
-- Lista: anexos de participantes de Serie A (63) y Serie B (84) de Wikipedia en español.
-- Serie A y B 2026 contrastadas con ligapro.ec. Datos: fichas de cada club y colores de RSSSF.
-- Emelec, Barcelona, El Nacional y Liga de Quito usan el color de la referencia de diseño.
-- Tungurahua SC usa un gris provisional (#9CA3AF): no se encontró su color.
-- Luq-San queda sin provincia: no se encontró su sede.
-- Los archivos de escudo de escudo_url todavía no existen en el proyecto.

insert into public.clubes (slug, nombre_oficial, nombre_popular, color_hex, escudo_url, provincia_id)
select c.slug, c.oficial, c.popular, c.color, '/images/escudos/' || c.slug || '.png', p.id
from (values
  -- Serie A 2026
  ('aucas', 'SOCIEDAD DEPORTIVA AUCAS', 'AUCAS', '#FFF200', 'Pichincha'),
  ('barcelona', 'BARCELONA SPORTING CLUB', 'BARCELONA', '#FBDB66', 'Guayas'),
  ('delfin', 'DELFÍN SPORTING CLUB', 'DELFÍN', '#0F0FFF', 'Manabí'),
  ('deportivo-cuenca', 'CLUB DEPORTIVO CUENCA', 'DEPORTIVO CUENCA', '#FF001A', 'Azuay'),
  ('emelec', 'CLUB SPORT EMELEC', 'EMELEC', '#376CD3', 'Guayas'),
  ('guayaquil-city', 'GUAYAQUIL CITY FÚTBOL CLUB', 'GUAYAQUIL CITY', '#99D4FE', 'Guayas'),
  ('independiente-del-valle', 'CLUB DEPORTIVO PROFESIONAL INDEPENDIENTE DEL VALLE', 'INDEPENDIENTE DEL VALLE', '#0040BF', 'Pichincha'),
  ('leones', 'LEONES FÚTBOL CLUB', 'LEONES', '#FF0000', 'Imbabura'),
  ('libertad', 'CLUB DEPORTIVO PROFESIONAL LIBERTAD FÚTBOL CLUB', 'LIBERTAD', '#FB791A', 'Loja'),
  ('liga-quito', 'LIGA DEPORTIVA UNIVERSITARIA', 'LIGA DE QUITO', '#FFFFFF', 'Pichincha'),
  ('macara', 'CLUB DEPORTIVO MACARÁ', 'MACARÁ', '#87CEFA', 'Tungurahua'),
  ('manta', 'MANTA FÚTBOL CLUB', 'MANTA', '#00CCFF', 'Manabí'),
  ('mushuc-runa', 'MUSHUC RUNA SPORTING CLUB', 'MUSHUC RUNA', '#590000', 'Tungurahua'),
  ('orense', 'ORENSE SPORTING CLUB', 'ORENSE', '#053D1C', 'El Oro'),
  ('tecnico-universitario', 'CLUB TÉCNICO UNIVERSITARIO', 'TÉCNICO UNIVERSITARIO', '#FF0000', 'Tungurahua'),
  ('universidad-catolica', 'CLUB DEPORTIVO UNIVERSIDAD CATÓLICA', 'UNIVERSIDAD CATÓLICA', '#009FFF', 'Pichincha'),

  -- Serie B 2026
  ('22-de-julio', '22 DE JULIO FÚTBOL CLUB', '22 DE JULIO', '#0000CD', 'Esmeraldas'),
  ('9-de-octubre', '9 DE OCTUBRE FÚTBOL CLUB', '9 DE OCTUBRE', '#00AE57', 'Guayas'),
  ('atletico-fc', 'CLUB PROFESIONAL ATLÉTICO FÚTBOL CLUB', 'ATLÉTICO FC', '#FF0000', 'Guayas'),
  ('cuenca-juniors', 'CLUB DEPORTIVO CUENCA JUNIORS', 'CUENCA JUNIORS', '#193F69', 'Azuay'),
  ('cumbaya', 'CUMBAYÁ FÚTBOL CLUB', 'CUMBAYÁ', '#01F2ED', 'Pichincha'),
  ('el-nacional', 'CLUB DEPORTIVO EL NACIONAL', 'EL NACIONAL', '#F13836', 'Pichincha'),
  ('gualaceo', 'GUALACEO SPORTING CLUB', 'GUALACEO', '#FFF200', 'Azuay'),
  ('independiente-juniors', 'CLUB DEPORTIVO INDEPENDIENTE JUNIORS', 'INDEPENDIENTE JUNIORS', '#0040BF', 'Pichincha'),
  ('liga-portoviejo', 'LIGA DEPORTIVA UNIVERSITARIA DE PORTOVIEJO', 'LIGA DE PORTOVIEJO', '#008000', 'Manabí'),
  ('san-antonio', 'SAN ANTONIO FÚTBOL CLUB', 'SAN ANTONIO', '#99CCEE', 'Imbabura'),
  ('santo-domingo', 'SOCIEDAD DEPORTIVO SANTO DOMINGO', 'SANTO DOMINGO', '#FF0000', 'Santo Domingo de los Tsáchilas'),
  ('vinotinto', 'VINOTINTO DEL ECUADOR FÚTBOL CLUB', 'VINOTINTO', '#800020', 'Pichincha'),

  -- Clubes históricos o de categorías inferiores
  ('2-de-marzo', 'CLUB DEPORTIVO 2 DE MARZO', '2 DE MARZO', '#008000', 'Imbabura'),
  ('america-ambato', 'AMÉRICA SPORTING CLUB', 'AMÉRICA DE AMBATO', '#000000', 'Tungurahua'),
  ('america-manta', 'CLUB DEPORTIVO AMÉRICA DE MANTA', 'AMÉRICA DE MANTA', '#000080', 'Manabí'),
  ('america-quito', 'CLUB DEPORTIVO AMÉRICA', 'AMÉRICA DE QUITO', '#008000', 'Pichincha'),
  ('atletico-audaz', 'CLUB DEPORTIVO ATLÉTICO AUDAZ', 'ATLÉTICO AUDAZ', '#008000', 'El Oro'),
  ('atletico-libertad', 'CLUB ATLÉTICO LIBERTAD', 'ATLÉTICO LIBERTAD', '#FF0000', 'Tungurahua'),
  ('atletico-manabi', 'CLUB ATLÉTICO MANABÍ', 'ATLÉTICO MANABÍ', '#FF0000', 'Manabí'),
  ('atletico-porteno', 'CLUB ATLÉTICO PORTEÑO', 'ATLÉTICO PORTEÑO', '#0093AF', 'Santa Elena'),
  ('atletico-riobamba', 'CLUB ATLÉTICO RIOBAMBA', 'ATLÉTICO RIOBAMBA', '#0000FF', 'Chimborazo'),
  ('atletico-santo-domingo', 'CLUB ATLÉTICO SANTO DOMINGO', 'ATLÉTICO SANTO DOMINGO', '#22B14C', 'Santo Domingo de los Tsáchilas'),
  ('atletico-vinotinto', 'CLUB ATLÉTICO VINOTINTO', 'ATLÉTICO VINOTINTO', '#800020', 'Pichincha'),
  ('audaz-octubrino', 'CLUB SOCIAL Y DEPORTIVO AUDAZ OCTUBRINO', 'AUDAZ OCTUBRINO', '#008000', 'El Oro'),
  ('bonita-banana', 'BONITA BANANA SPORTING CLUB', 'BONITA BANANA', '#FFFF00', 'El Oro'),
  ('brasil', 'CLUB SOCIAL Y DEPORTIVO BRASIL', 'BRASIL', '#FFFF00', 'Tungurahua'),
  ('brasilia', 'CLUB SOCIAL, CULTURAL Y DEPORTIVO BRASILIA', 'BRASILIA', '#66CCFF', 'Esmeraldas'),
  ('calvi', 'CALVI FÚTBOL CLUB', 'CALVI', '#0048BA', 'Guayas'),
  ('chacaritas', 'CHACARITAS FÚTBOL CLUB', 'CHACARITAS', '#000084', 'Tungurahua'),
  ('clan-juvenil', 'CLUB DEPORTIVO CLAN JUVENIL', 'CLAN JUVENIL', '#FF0000', 'Pichincha'),
  ('colon', 'CLUB DEPORTIVO COLÓN FÚTBOL CLUB', 'COLÓN', '#FF0000', 'Manabí'),
  ('deportivo-azogues', 'CLUB DEPORTIVO AZOGUES', 'DEPORTIVO AZOGUES', '#00AF00', 'Cañar'),
  ('deportivo-cotopaxi', 'CLUB SOCIAL Y DEPORTIVO COTOPAXI', 'DEPORTIVO COTOPAXI', '#0000FF', 'Cotopaxi'),
  ('deportivo-del-valle', 'CLUB SOCIAL Y DEPORTIVO DEL VALLE', 'DEPORTIVO DEL VALLE', '#008000', 'Manabí'),
  ('deportivo-quevedo', 'CLUB SOCIAL CULTURAL Y DEPORTIVO QUEVEDO', 'DEPORTIVO QUEVEDO', '#FF0000', 'Los Ríos'),
  ('deportivo-quito', 'SOCIEDAD DEPORTIVO QUITO', 'DEPORTIVO QUITO', '#000080', 'Pichincha'),
  ('deportivo-saquisili', 'CLUB DEPORTIVO SAQUISILÍ', 'DEPORTIVO SAQUISILÍ', '#FFFF00', 'Cotopaxi'),
  ('espana', 'SOCIEDAD DEPORTIVA ESPAÑA', 'ESPAÑA', '#FF0000', 'Pichincha'),
  ('espanol', 'CÍRCULO DEPORTIVO ESPAÑOL', 'ESPAÑOL', '#FF0000', 'Guayas'),
  ('esmeraldas-petrolero', 'CLUB SOCIAL, CULTURAL Y DEPORTIVO ESMERALDAS PETROLERO', 'ESMERALDAS PETROLERO', '#0000FF', 'Esmeraldas'),
  ('espoli', 'CLUB SOCIAL CULTURAL Y DEPORTIVO ESPOLI', 'ESPOLI', '#0000FF', 'Pichincha'),
  ('estibadores-navales', 'CLUB DEPORTIVO ESTIBADORES NAVALES', 'ESTIBADORES NAVALES', '#000000', 'Manabí'),
  ('everest', 'CLUB DEPORTIVO EVEREST', 'EVEREST', '#FF0000', 'Guayas'),
  ('ferroviarios', 'CÍRCULO DEPORTIVO FERROVIARIOS', 'FERROVIARIOS', '#FF0000', 'Guayas'),
  ('filanbanco', 'CLUB DEPORTIVO FILANBANCO', 'FILANBANCO', '#FF6600', 'Guayas'),
  ('flamengo', 'SOCIEDAD DEPORTIVA FLAMENGO', 'FLAMENGO', '#FF0000', 'Cotopaxi'),
  ('fuerza-amarilla', 'FUERZA AMARILLA SPORTING CLUB', 'FUERZA AMARILLA', '#FFFF00', 'El Oro'),
  ('grecia', 'CLUB DEPORTIVO GRECIA', 'GRECIA', '#66CCFF', 'Manabí'),
  ('green-cross', 'CLUB ATLÉTICO GREEN CROSS', 'GREEN CROSS', '#008000', 'Manabí'),
  ('guayaquil-sport', 'BÚHOS ULVR FÚTBOL CLUB', 'GUAYAQUIL SPORT', '#122562', 'Guayas'),
  ('imbabura', 'IMBABURA SPORTING CLUB', 'IMBABURA', '#0000FF', 'Imbabura'),
  ('inecel', 'CLUB DEPORTIVO INECEL', 'INECEL', '#0000FF', 'Manabí'),
  ('juvenil', 'CENTRO JUVENIL DEPORTIVO', 'JUVENIL', '#FF0000', 'Esmeraldas'),
  ('juventud-italiana', 'CLUB DEPORTIVO JUVENTUD ITALIANA', 'JUVENTUD ITALIANA', '#0000FF', 'Manabí'),
  ('juventus', 'CLUB SOCIAL Y DEPORTIVO JUVENTUS', 'JUVENTUS', '#000000', 'Esmeraldas'),
  ('ld-estudiantil', 'LIGA DEPORTIVA ESTUDIANTIL', 'L. D. ESTUDIANTIL', '#000080', 'Guayas'),
  ('liga-cuenca', 'LIGA DEPORTIVA DE CUENCA FÚTBOL CLUB', 'LIGA DE CUENCA', '#000080', 'Azuay'),
  ('liga-loja', 'LIGA DEPORTIVA UNIVERSITARIA DE LOJA', 'LIGA DE LOJA', '#008000', 'Loja'),
  ('luq-san', 'CLUB DEPORTIVO LUQ-SAN', 'LUQ-SAN', '#008000', null),
  ('manta-sport', 'MANTA SPORT CLUB', 'MANTA SPORT', '#0000FF', 'Manabí'),
  ('milagro-sc', 'MILAGRO SPORTING CLUB', 'MILAGRO SC', '#008000', 'Guayas'),
  ('municipal-canar', 'CLUB DEPORTIVO MUNICIPAL CAÑAR', 'MUNICIPAL CAÑAR', '#000080', 'Cañar'),
  ('norte-america', 'CLUB SPORT NORTE AMÉRICA', 'NORTE AMÉRICA', '#FFFFFF', 'Guayas'),
  ('olmedo', 'CENTRO DEPORTIVO OLMEDO', 'OLMEDO', '#0000FF', 'Chimborazo'),
  ('panama', 'PANAMÁ SPORTING CLUB', 'PANAMÁ', '#FFF200', 'Guayas'),
  ('patria', 'CLUB SPORT PATRIA', 'PATRIA', '#CCCCCC', 'Guayas'),
  ('politecnico', 'CLUB DEPORTIVO POLITÉCNICO', 'POLITÉCNICO', '#FF0000', 'Pichincha'),
  ('quininde', 'QUININDÉ SPORTING CLUB', 'QUININDÉ', '#008000', 'Esmeraldas'),
  ('river-plate-riobamba', 'CLUB ATLÉTICO RIVER PLATE DE RIOBAMBA', 'RIVER PLATE DE RIOBAMBA', '#FF0000', 'Chimborazo'),
  ('rocafuerte', 'ROCAFUERTE FÚTBOL CLUB', 'ROCAFUERTE', '#FF0000', 'Guayas'),
  ('santa-rita', 'CLUB DEPORTIVO Y SOCIAL SANTA RITA', 'SANTA RITA', '#0000FF', 'Los Ríos'),
  ('santos', 'SANTOS FÚTBOL CLUB', 'SANTOS', '#000000', 'El Oro'),
  ('tungurahua', 'TUNGURAHUA SPORTING CLUB', 'TUNGURAHUA', '#9CA3AF', 'Tungurahua'),
  ('ud-valdez', 'UNIÓN DEPORTIVA VALDEZ', 'U. D. VALDEZ', '#008000', 'Guayas'),
  ('udj', 'UNIÓN DEPORTIVA JUVENIL', 'UDJ', '#00003C', 'Esmeraldas'),
  ('utc', 'CLUB DEPORTIVO DE LA UNIVERSIDAD TÉCNICA DE COTOPAXI', 'UTC', '#0000FF', 'Cotopaxi'),
  ('ute', 'CLUB SOCIAL Y DEPORTIVO UNIVERSIDAD TECNOLÓGICA EQUINOCCIAL', 'UTE', '#0000FF', 'Pichincha'),
  ('valdez', 'VALDEZ SPORTING CLUB', 'VALDEZ', '#008000', 'Guayas'),
  ('valle-del-chota', 'CLUB DEPORTIVO VALLE DEL CHOTA', 'VALLE DEL CHOTA', '#008000', 'Imbabura')
) as c (slug, oficial, popular, color, provincia)
left join public.provincias p on p.nombre = c.provincia;

-- Si el total o una provincia no coincide, la migración completa se cancela.
do $$
begin
  if (select count(*) from public.clubes) <> 95 then
    raise exception 'Se esperaban 95 clubes';
  end if;
  if (select count(*) from public.clubes where provincia_id is null) <> 1 then
    raise exception 'Solo Luq-San debe quedar sin provincia';
  end if;
end;
$$;
